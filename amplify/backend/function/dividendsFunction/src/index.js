const axios = require('axios');
require('cross-fetch/polyfill');
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const fs = require('fs');

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
        variables: { owner: event.identity.claims[true ? 'sub' : 'cognito:username'] }
    });

    const list = [];
    const symbols = data.holdingsByOwner.items.map(holding => holding.symbol);
    // const { data: benzingaData } = await axios.get(`https://api.benzinga.com/api/v2.1/calendar/dividends?token=${process.env.BENZINGA_TOKEN}&parameters[tickers]=${symbols.join(',')}`);
    let benzingaData;

    try {
        const data = fs.readFileSync('benzingaData', 'utf8')
        benzingaData = JSON.parse(data)
    } catch (err) {
        console.error(err)
    }

    for (const { dividend, payable_date, ticker, ...rest } of benzingaData['dividends']) {
        const match = data.holdingsByOwner.items.find(item => item.symbol === ticker);
        if (match) {
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

    }

    return JSON.stringify(list);
};
