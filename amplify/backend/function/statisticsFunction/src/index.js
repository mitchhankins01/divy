/* Amplify Params - DO NOT EDIT
	API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT
	API_HOLDINGS_GRAPHQLAPIIDOUTPUT
	API_HOLDINGS_STRIPEEVENTTABLE_ARN
	API_HOLDINGS_STRIPEEVENTTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
require('cross-fetch/polyfill');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const fs = require('fs');

const saveEvent = async (id, type, message) => {
    try {
      await docClient.put({
        TableName: process.env.API_HOLDINGS_STRIPEEVENTTABLE_NAME,
        Item: {
          id: id,
          type: type,
          message: message,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      }).promise();
    } catch (error) {
      console.log(error);
    }
  }

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

    if (!symbols.length) {
        return JSON.stringify(list);
    }

    const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
        params: { region: 'US', symbols: symbols.join(',') },
        headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.YAHOO_KEY
        }
    };

    try {
        // const unparsedData = fs.readFileSync('yahooData', 'utf8')
        // yahooData = JSON.parse(unparsedData)
        const { data: yahooData } = await axios.request(options);

        for (const { symbol, regularMarketPrice, dividendRate = 0, dividendYield = 0, ...rest } of yahooData.quoteResponse.result) {
            // const match = data.holdingsByOwner.items.find(item => replaceAll(item.symbol, '/', '-') === symbol);
            const match = data.holdingsByOwner.items.find(item => item.symbol === symbol);
            
            if (match) {
                const costBasis = match.price * match.quantity;
                const marketValue = regularMarketPrice * match.quantity;
                const gain = marketValue - costBasis;

                list.push({
                    ...match,
                    gain,
                    symbol,
                    costBasis,
                    marketValue,
                    dividendRate,
                    dividendYield,
                    buyPrice: match.price,
                    quantity: match.quantity,
                    marketPrice: regularMarketPrice,
                    totalDividends: dividendRate * match.quantity,
                    id: `${symbol}.${regularMarketPrice}`,
                    holdingID: match.id
                });
            } else {
                await saveEvent(symbol, 'stats_func_symbol_404', JSON.stringify({ 
                    symbol,
                    owner0: event.identity.claims['sub'],
                    owner1: event.identity.claims['cognito:username']
                }));
            }
        }
    } catch (error) {
        console.log(error);
    }

    return JSON.stringify(list);
};
