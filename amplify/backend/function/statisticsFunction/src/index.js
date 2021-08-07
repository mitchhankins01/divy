require('cross-fetch/polyfill');
const axios = require('axios');
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;

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

const formatNumber = number => {
    if (isNaN(Number(number))) {
        return (0).toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    return Number(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
}


exports.handler = async (event) => {
    const query = gql`query HoldingsByOwner(
        $owner: String
        $sortDirection: ModelSortDirection
        $filter: ModelHoldingFilterInput
        $limit: Int
        $nextToken: String
      ) {
        holdingsByOwner(
          owner: $owner
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id
            symbol
            price
            quantity
            comments
            owner
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;

    const client = await graphqlClient.hydrated();
    const { data } = await client.query({
        query,
        variables: { owner: event.identity.claims[false ? 'sub' : 'cognito:username'] }
    });

    const list = [{
        symbol: 'STAG',
        companyName: 'STAG Industrial Inc',
        primaryExchange: 'NEW YORK STOCK EXCHANGE, INC.',
        calculationPrice: 'close',
        open: 35.81,
        openTime: 1618579801077,
        openSource: 'official',
        close: 35.56,
        closeTime: 1618603202571,
        closeSource: 'official',
        high: 35.88,
        highTime: 1618603200032,
        highSource: '15 minute delayed price',
        low: 35.45,
        lowTime: 1618583733891,
        lowSource: 'IEX real time price',
        latestPrice: 35.56,
        latestSource: 'Close',
        latestTime: 'April 16, 2021',
        latestUpdate: 1618603202571,
        latestVolume: 683636,
        iexRealtimePrice: null,
        iexRealtimeSize: null,
        iexLastUpdated: null,
        delayedPrice: 35.54,
        delayedPriceTime: 1618603197104,
        oddLotDelayedPrice: 35.56,
        oddLotDelayedPriceTime: 1618603199976,
        extendedPrice: 35.9,
        extendedChange: 0.34,
        extendedChangePercent: 0.00956,
        extendedPriceTime: 1618615959146,
        previousClose: 35.68,
        previousVolume: 967523,
        change: -0.12,
        changePercent: -0.00336,
        volume: 683636,
        iexMarketPercent: null,
        iexVolume: null,
        avgTotalVolume: 1181403,
        iexBidPrice: null,
        iexBidSize: null,
        iexAskPrice: null,
        iexAskSize: null,
        iexOpen: 35.54,
        iexOpenTime: 1618603187892,
        iexClose: 35.54,
        iexCloseTime: 1618603187892,
        marketCap: 5656971851,
        peRatio: 26.94,
        week52High: 35.88,
        week52Low: 21.33,
        ytdChange: 0.14494063776539926,
        lastTradeTime: 1618603197104,
        isUSMarketOpen: false
    },
    {
        symbol: 'O',
        companyName: 'Realty Income Corp.',
        primaryExchange: 'NEW YORK STOCK EXCHANGE, INC.',
        calculationPrice: 'close',
        open: 67.17,
        openTime: 1618579801314,
        openSource: 'official',
        close: 67.02,
        closeTime: 1618603202060,
        closeSource: 'official',
        high: 67.38,
        highTime: 1618603199987,
        highSource: '15 minute delayed price',
        low: 66.82,
        lowTime: 1618583245376,
        lowSource: '15 minute delayed price',
        latestPrice: 67.02,
        latestSource: 'Close',
        latestTime: 'April 16, 2021',
        latestUpdate: 1618603202060,
        latestVolume: 2438170,
        iexRealtimePrice: null,
        iexRealtimeSize: null,
        iexLastUpdated: null,
        delayedPrice: 67.02,
        delayedPriceTime: 1618603199987,
        oddLotDelayedPrice: 67.01,
        oddLotDelayedPriceTime: 1618603199401,
        extendedPrice: 67.2,
        extendedChange: 0.18,
        extendedChangePercent: 0.00269,
        extendedPriceTime: 1618616723108,
        previousClose: 66.92,
        previousVolume: 2613766,
        change: 0.1,
        changePercent: 0.00149,
        volume: 2438170,
        iexMarketPercent: null,
        iexVolume: null,
        avgTotalVolume: 2841865,
        iexBidPrice: null,
        iexBidSize: null,
        iexAskPrice: null,
        iexAskSize: null,
        iexOpen: 67.01,
        iexOpenTime: 1618603193168,
        iexClose: 67.01,
        iexCloseTime: 1618603193168,
        marketCap: 25032051831,
        peRatio: 58.79,
        week52High: 67.38,
        week52Low: 45.7,
        ytdChange: 0.09179745629090476,
        lastTradeTime: 1618603199987,
        isUSMarketOpen: false
    },
    {
        symbol: 'MNR',
        companyName: 'Monmouth Real Estate Investment Corp. - Class A',
        primaryExchange: 'NEW YORK STOCK EXCHANGE, INC.',
        calculationPrice: 'close',
        open: 18.56,
        openTime: 1618579800907,
        openSource: 'official',
        close: 18.33,
        closeTime: 1618603202507,
        closeSource: 'official',
        high: 18.59,
        highTime: 1618579803620,
        highSource: 'IEX real time price',
        low: 18.23,
        lowTime: 1618585370144,
        lowSource: '15 minute delayed price',
        latestPrice: 18.33,
        latestSource: 'Close',
        latestTime: 'April 16, 2021',
        latestUpdate: 1618603202507,
        latestVolume: 188625,
        iexRealtimePrice: null,
        iexRealtimeSize: null,
        iexLastUpdated: null,
        delayedPrice: 18.325,
        delayedPriceTime: 1618603194506,
        oddLotDelayedPrice: 18.34,
        oddLotDelayedPriceTime: 1618603197307,
        extendedPrice: 18.33,
        extendedChange: 0,
        extendedChangePercent: 0,
        extendedPriceTime: 1618614000004,
        previousClose: 18.43,
        previousVolume: 224828,
        change: -0.1,
        changePercent: -0.00543,
        volume: 188625,
        iexMarketPercent: null,
        iexVolume: null,
        avgTotalVolume: 318128,
        iexBidPrice: null,
        iexBidSize: null,
        iexAskPrice: null,
        iexAskSize: null,
        iexOpen: 18.34,
        iexOpenTime: 1618603196308,
        iexClose: 18.34,
        iexCloseTime: 1618603196308,
        marketCap: 1801850255,
        peRatio: -68.37,
        week52High: 18.86,
        week52Low: 10.48,
        ytdChange: 0.0635304898673275,
        lastTradeTime: 1618603196308,
        isUSMarketOpen: false
    }];
    for (const { symbol, quantity } of data.holdingsByOwner.items) {
        try {
            const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_2d68b4fe291941b99ab69c2f105fa629`);
            console.log(data);
            if (data.length) {
                const amount = formatNumber(Number(quantity) * Number(data[0].amount));

                list.push({
                    ...data[0],
                    quantity,
                    allDay: true,
                    title: `${symbol} $${amount}`,
                    id: symbol,
                    start: data[0].paymentDate,
                    extendedProps: { amount },
                });
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data === 'Unknown symbol') {
                list.push({ title: 'warning', description: `Symbol ${symbol} not found.`, id: `${symbol}-${new Date()}` });
            } else {
                console.log(error);
                return JSON.stringify([]);
            }
        }
    }

    return JSON.stringify(list);
};

// const documentClient = new AWS.DynamoDB.DocumentClient();
// const params = {
//     TableName: 'Holding-5u4nr7xsi5bhtgqledpdimiyz4-dev',
//     FilterExpression: "#owner = :owner",
//     ExpressionAttributeNames: {
//         "#owner": "owner"
//     },
//     ExpressionAttributeValues: {
//         // ":owner": 'f3ea1aa2-13e2-4f08-882c-acfab0dfffe4'
//         ":owner": event.identity.claims['cognito:username']
//     }
// };
// const result = await documentClient.scan(params).promise();