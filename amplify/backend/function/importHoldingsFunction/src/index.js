/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    STORAGE_IMPORTHOLDINGSSTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */
require('cross-fetch/polyfill');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const xlsx = require('xlsx');
const axios = require('axios');

exports.handler = async (event) => {
    const params = {
        Bucket: process.env.STORAGE_IMPORTHOLDINGSSTORAGE_BUCKETNAME,
        Key: `public/${event.arguments.fileKey}`,
        // Bucket: 'importholdingsbucket183939-dev',
        // Key: 'test.xlsx'
    };
    const data = await s3.getObject(params).promise();
    const workbook = xlsx.read(data.Body, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonSheet = xlsx.utils.sheet_to_json(worksheet, { blankrows: false, });
    const existingSymbols = event.arguments.existingSymbols.split(',');

    let symbols = [];
    const failSymbols = [];
    const successSymbols = [];
    const formattedSheet = jsonSheet.map((e, index) => {
        const formattedSymbol = e.symbol.trim().toUpperCase();

        if (symbols.includes(formattedSymbol)) {
            failSymbols.push({
                id: `${formattedSymbol}${index}`,
                symbol: formattedSymbol,
                reason: 'Symbol is a duplicate.'
            });
        } else if (existingSymbols.includes(formattedSymbol)) {
            failSymbols.push({
                id: `${formattedSymbol}${index}`,
                symbol: formattedSymbol,
                reason: 'Symbol already exists in portfolio.'
            });
        } else {
            symbols.push(formattedSymbol);
            return { ...e, id: `${formattedSymbol}${index}`, symbol: formattedSymbol };
        }
    }).filter(e => e !== undefined);

    const chunkedSymbols = symbols.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 45);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);

    try {
        const yahooData = [];

        for (const chunkedItems of chunkedSymbols) {
            const { data: { quoteResponse } } = await axios.request({
                method: 'GET',
                url: `https://${process.env.YAHOO_HOST}/market/v2/get-quotes`,
                params: { region: 'US', symbols: chunkedItems.join(',') },
                headers: {
                    'x-rapidapi-host': process.env.YAHOO_HOST,
                    'x-rapidapi-key': process.env.YAHOO_KEY
                }
            });
            yahooData.push(...quoteResponse.result);
        }

        yahooData.forEach((yahooItem, index) => {
            symbols = symbols.filter(e => e !== yahooItem.symbol);

            const sheetItem = formattedSheet.find(e => e.symbol === yahooItem.symbol);
            const parsedNumberOfShares = Number(sheetItem.numberOfShares);
            const parsedPricePerShare = Number(sheetItem.pricePerShare);

            if (isNaN(parsedNumberOfShares)) {
                failSymbols.push({
                    symbol: sheetItem.symbol,
                    id: `${sheetItem.symbol}${index}`,
                    reason: `Number of shares is not valid, got "${sheetItem.numberOfShares}".`
                });
            } else if (isNaN(parsedPricePerShare)) {
                failSymbols.push({
                    symbol: sheetItem.symbol,
                    id: `${sheetItem.symbol}${index}`,
                    reason: `Price per share is not valid, got "${sheetItem.pricePerShare}".`
                });
            } else {
                successSymbols.push({
                    ...sheetItem,
                    id: `${sheetItem.symbol}${index}`,
                    numberOfShares: parsedNumberOfShares,
                    pricePerShare: parsedPricePerShare,
                    comments: `${sheetItem.comments} - Automatically imported by Divy`
                });
            }
        });

        symbols.forEach((symbol, index) => {
            failSymbols.push({ symbol, id: `${symbol}${index}`, reason: 'Symbol could not be found.' });
        });
    } catch (error) {
        console.log(error.message);
        throw new Error('Corrupt spreadsheet.')
    }

    return { successSymbols, failSymbols };
};
