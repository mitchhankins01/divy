/* Amplify Params - DO NOT EDIT
  API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT
  API_HOLDINGS_GRAPHQLAPIIDOUTPUT
  API_HOLDINGS_HOLDINGTABLE_ARN
  API_HOLDINGS_HOLDINGTABLE_NAME
  API_HOLDINGS_PORTFOLIOTABLE_ARN
  API_HOLDINGS_PORTFOLIOTABLE_NAME
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
  const query = gql`query ListHoldings(
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        symbol
        price
        quantity
        comments
        owner
        createdAt
        updatedAt
        portfolio {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      nextToken
    }
  }
`;

  const client = await graphqlClient.hydrated();
  const { data } = await client.query({
    query,
    variables: { limit: 1000, filter: { owner: { eq: event.identity.claims['sub'] } } },
  });
  const symbols = [...new Set(data.listHoldings.items.map(holding => holding.symbol))];

  if (!symbols.length) {
    return JSON.stringify([]);
  }

  const chunkedSymbols = symbols.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 45);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  try {
    const yahooData = {};

    for (const chunkedItems of chunkedSymbols) {
      const options = {
        method: 'GET',
        url: `https://${process.env.YAHOO_HOST}/market/v2/get-quotes`,
        params: { region: 'US', symbols: chunkedItems.join(',') },
        headers: {
          'x-rapidapi-host': process.env.YAHOO_HOST,
          'x-rapidapi-key': process.env.YAHOO_KEY
        }
      };

      const { data } = await axios.request(options);

      if (data.quoteResponse.result) {
        for (const result of data.quoteResponse.result) {
          yahooData[result.symbol] = result;
        }
      }
    }

    const list = data.listHoldings.items.map(e => {
      const yahooItem = yahooData[e.symbol];

      if (!yahooItem) {
        return {
          ...e,
          costBasis: e.price * e.quantity,
          buyPrice: e.price,
          latestDividendRate: 0,
          latestDividendYield: 0,
          marketValue: 0,
          gain: 0,
          marketPrice: 0,
          totalDividends: 0
        };
      } else {
        const {
          symbol,
          regularMarketPrice = 0,
          dividendRate = 0,
          dividendYield = 0,
          trailingAnnualDividendRate = 0,
          trailingAnnualDividendYield = 0,
          ...rest
        } = yahooItem;

        const latestDividendRate = dividendRate || trailingAnnualDividendRate || 0;
        const latestDividendYield = dividendYield || trailingAnnualDividendYield || 0;
        const costBasis = e.price * e.quantity;
        const marketValue = regularMarketPrice * e.quantity;
        const gain = marketValue - costBasis;

        return {
          ...e,
          gain,
          symbol,
          costBasis,
          marketValue,
          dividendRate: latestDividendRate,
          dividendYield: latestDividendYield,
          buyPrice: e.price,
          quantity: e.quantity,
          marketPrice: regularMarketPrice,
          totalDividends: latestDividendRate * e.quantity,
          id: e.id,
          holdingID: e.id
        };
      }
    });

    return JSON.stringify(list)
  } catch (error) {
    console.log(error);
    return JSON.stringify([]);
  }
};



// require('cross-fetch/polyfill');
// const AWS = require('aws-sdk');
// const docClient = new AWS.DynamoDB.DocumentClient();
// const axios = require('axios');
// const gql = require('graphql-tag');
// const AWSAppSyncClient = require('aws-appsync').default;
// const fs = require('fs');

// const saveEvent = async (id, type, message) => {
//   try {
//     await docClient.put({
//       TableName: process.env.API_HOLDINGS_STRIPEEVENTTABLE_NAME,
//       Item: {
//         id: id,
//         type: type,
//         message: message,
//         updatedAt: new Date().toISOString(),
//         createdAt: new Date().toISOString()
//       }
//     }).promise();
//   } catch (error) {
//     console.log(error);
//   }
// }

// const graphqlClient = new AWSAppSyncClient({
//   url: process.env.API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT,
//   region: process.env.AWS_REGION,
//   auth: {
//     type: 'AWS_IAM',
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       sessionToken: process.env.AWS_SESSION_TOKEN
//     }
//   },
//   disableOffline: true
// }, {
//   defaultOptions: {
//     query: {
//       fetchPolicy: 'network-only',
//       errorPolicy: 'all',
//     },
//   },
// });

// exports.handler = async (event) => {
//   const query = gql`query ListHoldings(
//     $filter: ModelHoldingFilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
//       items {
//         id
//         symbol
//         price
//         quantity
//         comments
//         owner
//         createdAt
//         updatedAt
//         portfolio {
//           id
//           name
//           createdAt
//           updatedAt
//           owner
//         }
//       }
//       nextToken
//     }
//   }
// `;

//   const client = await graphqlClient.hydrated();
//   const { data } = await client.query({
//     query,
//     variables: {  limit: 1000, filter: { owner: { eq: event.identity.claims['sub'] } } },
//   });

//   let symbols = data.listHoldings.items.map(holding => holding.symbol);
//   const list = [];

//   if (!symbols.length) {
//     return JSON.stringify(list);
//   }

//   const chunkedSymbols = symbols.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / 45);

//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [];
//     }

//     resultArray[chunkIndex].push(item);
//     return resultArray;
//   }, []);

//   try {
//     const yahooData = [];

//     for (const chunkedItems of chunkedSymbols) {
//       const options = {
//         method: 'GET',
//         url: `https://${process.env.YAHOO_HOST}/market/v2/get-quotes`,
//         params: { region: 'US', symbols: chunkedItems.join(',') },
//         headers: {
//           'x-rapidapi-host': process.env.YAHOO_HOST,
//           'x-rapidapi-key': process.env.YAHOO_KEY
//         }
//       };

//       const { data } = await axios.request(options);
//       yahooData.push(...data.quoteResponse.result);
//     }

//     for (const { symbol, regularMarketPrice, dividendRate, dividendYield, trailingAnnualDividendRate, trailingAnnualDividendYield, ...rest } of yahooData) {
//       // const match = data.listHoldings.items.find(item => replaceAll(item.symbol, '/', '-') === symbol);
//       const match = data.listHoldings.items.find(item => item.symbol === symbol);
//       symbols = symbols.filter(e => e !== symbol);

//       if (match) {
        // const latestDividendRate = dividendRate || trailingAnnualDividendRate || 0;
        // const latestDividendYield = dividendYield || trailingAnnualDividendYield || 0;
        // const costBasis = match.price * match.quantity;
        // const marketValue = regularMarketPrice * match.quantity;
        // const gain = marketValue - costBasis;

//         list.push({
//           ...match,
//           gain,
//           symbol,
//           costBasis,
//           marketValue,
//           dividendRate: latestDividendRate,
//           dividendYield: latestDividendYield,
//           buyPrice: match.price,
//           quantity: match.quantity,
//           marketPrice: regularMarketPrice,
//           totalDividends: latestDividendRate * match.quantity,
//           id: match.id,
//           holdingID: match.id
//         });
//       } else {
//         await saveEvent(symbol, 'stats_func_symbol_404', JSON.stringify({
//           symbol,
//           owner: event.identity.claims['sub'],
//         }));
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   // add back in missing items
//   symbols.forEach(symbol => {
//     const match = data.listHoldings.items.find(item => item.symbol === symbol);

//     list.push({
//       ...match,
//       costBasis: match.price * match.quantity,
//       buyPrice: match.price,
//       latestDividendRate: 0,
//       latestDividendYield: 0,
//       marketValue: 0,
//       gain: 0,
//       marketPrice: 0,
//       totalDividends: 0
//     });
//   });

//   return JSON.stringify(list);
// };
