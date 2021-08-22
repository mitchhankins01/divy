require('cross-fetch/polyfill');
const axios = require('axios');
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
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
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
    const symbols = data.holdingsByOwner.items.map(holding => holding.symbol);
    const list = [];

    const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
        params: { region: 'US', symbols: replaceAll(symbols.join(','), '/', '-') },
        headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': '9ea30f36b7msh44578fed17f43b8p19d68bjsn7efdcdb2cfae'
        }
    };

    try {
        // What happens if symbol is not found, does the loop break?
        // what happens if user has no symbols?
        const unparsedData = fs.readFileSync('yahooData', 'utf8')
        yahooData = JSON.parse(unparsedData)
        // const { data: yahooData } = await axios.request(options);

        for (const { symbol, regularMarketPrice, ...rest } of yahooData.quoteResponse.result) {
            const match = data.holdingsByOwner.items.find(item => replaceAll(item.symbol, '/', '-') === symbol);

            list.push({
                rest,
                symbol,
                buyPrice: match.price,
                marketPrice: regularMarketPrice,
                quantity: match.quantity,
                id: `${symbol}.${regularMarketPrice}`,
            });
        }
    } catch (error) {
        console.log(error);
    }

    return JSON.stringify(list);
};
