/* Amplify Params - DO NOT EDIT
    API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT
    API_HOLDINGS_GRAPHQLAPIIDOUTPUT
    API_HOLDINGS_HOLDINGTABLE_ARN
    API_HOLDINGS_HOLDINGTABLE_NAME
    ENV
    REGION
    STORAGE_IMPORTHOLDINGSSTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */
require('cross-fetch/polyfill');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const xlsx = require('xlsx');
const axios = require('axios');
const AWSAppSyncClient = require('aws-appsync').default;
const {
    chunkArray,
    holdingsByOwnerQuery,
    addHoldingMutation,
    updateHoldingMutation,
} = require('./helpers');

const graphqlClient = new AWSAppSyncClient({
    url: process.env.API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.AWS_REGION,
    auth: {
        type: 'AWS_IAM',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN
        }
    },
    disableOffline: true
}, {
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    },
});

exports.handler = async (event) => {

    const processInput = async ({ symbolKey, quantityKey, priceKey, symbolReplace }) => {

        const client = await graphqlClient.hydrated();
        const { data } = await client.query({ query: holdingsByOwnerQuery, variables: { owner: event.identity.claims['sub'], limit: 500 } });

        const params = {
            Bucket: process.env.STORAGE_IMPORTHOLDINGSSTORAGE_BUCKETNAME,
            Key: `public/${event.arguments.fileKey}`,
            // Bucket: 'importholdingsbucket183939-dev',
            // Key: 'test.xlsx'
            // Key: 'Portfolio_Positions_Nov-05-2021.csv'
            // Key: 'tastyworks_positions_mitchhankins_2021-11-04.csv'
        };
        const s3Data = await s3.getObject(params).promise();

        const workbook = xlsx.read(s3Data.Body, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonSheet = xlsx.utils.sheet_to_json(worksheet, { blankrows: false, });

        const newSymbols = [];
        const failSymbols = [];
        const updateSymbols = [];

        let yahooToDo = [];
        const existingSymbols = data.holdingsByOwner.items.map(holding => holding.symbol);

        const seenSymbols = new Set();
        const uniques = jsonSheet.filter((e, i) => {
            if (seenSymbols.has(e[symbolKey])) {
                failSymbols.push({
                    id: `${e[symbolKey]}-${i}`,
                    symbol: e[symbolKey],
                    reason: 'Symbol is a duplicate in the import file.'
                });
                return false;
            } else if (e[symbolKey] && e[quantityKey] && e[priceKey]) {
                seenSymbols.add(e[symbolKey]);
                return true;
            }
        });

        for (const e of uniques) {
            const symbol = e[symbolKey].replace(symbolReplace, '-');
            const quantity = Number(e[quantityKey]);
            const tradePrice = Math.abs(e[priceKey]);

            if (existingSymbols.includes(symbol)) {
                const match = data.holdingsByOwner.items.find(item => item.symbol === symbol);

                if (quantity === Number(match.quantity) && tradePrice === Number(match.price)) {
                    failSymbols.push({
                        id: match.id,
                        symbol: match.symbol,
                        reason: 'Symbol already exists in portfolio and has not changed in price or quantity.'
                    });
                } else {
                    if (quantity === Number(match.quantity)) {
                        updateSymbols.push({
                            symbol,
                            id: match.id,
                            numberOfShares: quantity,
                            pricePerShare: tradePrice,
                            reason: `Price changed from $${match.price} to $${tradePrice}.`
                        });
                    } else if (tradePrice === Number(match.price)) {
                        updateSymbols.push({
                            symbol,
                            id: match.id,
                            numberOfShares: quantity,
                            pricePerShare: tradePrice,
                            reason: `Quantity changed from ${match.quantity} to ${quantity}.`
                        });
                    } else {
                        updateSymbols.push({
                            symbol,
                            id: match.id,
                            numberOfShares: quantity,
                            pricePerShare: tradePrice,
                            reason: `Price changed from $${match.price} to $${tradePrice} and quantity changed from ${match.quantity} to ${quantity}.`
                        });
                    }
                    await client.mutate({
                        mutation: updateHoldingMutation,
                        variables: {
                            input: {
                                id: match.id,
                                price: tradePrice,
                                symbol: match.symbol,
                                comments: match.comments,
                                quantity: quantity,
                            }
                        }
                    });
                }
            } else {
                yahooToDo.push({ symbol, quantity, tradePrice });
            }
        }

        try {
            const chunkedYahooToDo = chunkArray(yahooToDo);

            for (const chunkedItems of chunkedYahooToDo) {
                const mappedSymbols = chunkedItems.map(e => e.symbol);
                const { data: { quoteResponse } } = await axios.request({
                    method: 'GET',
                    url: `https://${process.env.YAHOO_HOST}/market/v2/get-quotes`,
                    params: { region: 'US', symbols: mappedSymbols.join(',') },
                    headers: {
                        'x-rapidapi-host': process.env.YAHOO_HOST,
                        'x-rapidapi-key': process.env.YAHOO_KEY
                    }
                });

                for (const yahooItem of quoteResponse.result) {
                    yahooToDo = yahooToDo.filter(e => e.symbol !== yahooItem.symbol);
                    const chunkedItem = chunkedItems.find(e => e.symbol === yahooItem.symbol);

                    await client.mutate({
                        mutation: addHoldingMutation,
                        variables: {
                            input: {
                                comments: '',
                                symbol: chunkedItem.symbol,
                                price: chunkedItem.tradePrice,
                                quantity: chunkedItem.quantity,
                                owner: event.identity.claims['sub'],
                            }
                        }
                    });
                    newSymbols.push({
                        id: `${yahooItem.symbol}-${yahooItem.regularMarketPrice}`,
                        symbol: chunkedItem.symbol,
                        numberOfShares: chunkedItem.quantity,
                        pricePerShare: chunkedItem.tradePrice,
                        comments: 'Automatically imported by Divy'
                    });
                }
            }

            yahooToDo.forEach((e, index) => {
                failSymbols.push({ symbol: e.symbol, id: `${e.symbol}${index}`, reason: 'Symbol could not be found.' });
            });
        } catch (error) {
            console.log(error.message);
            return { newSymbols: [], failSymbols: [], updateSymbols: [] };
        }
        return { newSymbols, failSymbols, updateSymbols };
    }

    switch (event.arguments.type) {
        case 'tastyworks':
            return await processInput({
                symbolKey: 'Symbol',
                quantityKey: 'Quantity',
                priceKey: 'Trade Price',
                symbolReplace: '/'
            });
        case 'fidelity':
            return await processInput({
                symbolKey: 'Symbol',
                quantityKey: 'Quantity',
                priceKey: 'Cost Basis Per Share',
                symbolReplace: '/'
            });
        case 'spreadsheet':
            return await processInput({
                symbolKey: 'symbol',
                quantityKey: 'numberOfShares',
                priceKey: 'pricePerShare',
                symbolReplace: undefined
            });
        default:
            return { newSymbols: [], failSymbols: [], updateSymbols: [] };
    }
};
