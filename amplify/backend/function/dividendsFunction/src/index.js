const axios = require('axios');
require('cross-fetch/polyfill');
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

const runIex = async (data) => {
    const list = [];

    for (const { symbol, quantity } of data.holdingsByOwner.items) {
        try {
            const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol.replace('/', '.')}/dividends/next?token=pk_19b81527fa064e4a8c9f709b3174317d`);

            console.log(data)
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
            if (error.response.data === 'Unknown symbol') {
                list.push({ title: 'warning', description: `Symbol ${symbol} not found.`, id: `${symbol}-${new Date()}` });
            } else {
                console.log(error);
                return JSON.stringify([]);
            }
        }
    }

    return JSON.stringify(list);
}

const runBen = async (data) => {
    const list = [];
    const symbols = data.holdingsByOwner.items.map(holding => holding.symbol);
    //upper case
    const { data: benzingaData } = await axios.get(`https://api.benzinga.com/api/v2.1/calendar/dividends?token=871b3e8d86f34211b2fe278e1f347d23&parameters[tickers]=${symbols.join(',')}`);
    // const { data: benzingaData } = await axios.get(`https://api.benzinga.com/api/v2.1/calendar/dividends?token=871b3e8d86f34211b2fe278e1f347d23&parameters[tickers]=${symbols.join(',')}&parameters[date_from]=2021-07-01`);
    console.log(benzingaData)


    for (const { dividend, payable_date, ticker, ...rest } of benzingaData['dividends']) {
        const match = data.holdingsByOwner.items.find(item => item.symbol === ticker);
        const amount = formatNumber(Number(match.quantity) * Number(dividend));

        list.push({
            ...rest,
            quantity: match.quantity,
            allDay: true,
            title: `${ticker} $${amount}`,
            id: `${ticker} $${payable_date}`,
            symbol: ticker,
            start: payable_date,
            paymentDate: payable_date,
            extendedProps: { amount },
        });
    }

    return JSON.stringify(list);
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
        variables: { owner: event.identity.claims[true ? 'sub' : 'cognito:username'] }
    });

    // return runIex(data);
    return runBen(data);
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