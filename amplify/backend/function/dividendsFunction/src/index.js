/* Amplify Params - DO NOT EDIT
    API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT
    API_HOLDINGS_GRAPHQLAPIIDOUTPUT
    API_HOLDINGS_HOLDINGTABLE_ARN
    API_HOLDINGS_HOLDINGTABLE_NAME
    API_HOLDINGS_PORTFOLIOTABLE_ARN
    API_HOLDINGS_PORTFOLIOTABLE_NAME
    ENV
    REGION
Amplify Params - DO NOT EDIT */
// require('cross-fetch/polyfill');
// const axios = require('axios');
// const gql = require('graphql-tag');
// const AWSAppSyncClient = require('aws-appsync').default;

// const graphqlClient = new AWSAppSyncClient({
//     url: process.env.API_HOLDINGS_GRAPHQLAPIENDPOINTOUTPUT,
//     region: process.env.AWS_REGION,
//     auth: {
//         type: 'AWS_IAM',
//         credentials: {
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//             sessionToken: process.env.AWS_SESSION_TOKEN
//         }
//     },
//     disableOffline: true
// }, {
//     defaultOptions: {
//         query: {
//             fetchPolicy: 'network-only',
//             errorPolicy: 'all',
//         },
//     },
// });

// function replaceAll(str, find, replace) {
//     return str.replace(new RegExp(find, 'g'), replace);
// }

// const formatNumber = number => {
//     if (isNaN(Number(number))) {
//         return (0).toLocaleString(undefined, { maximumFractionDigits: 2 });
//     }

//     return Number(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
// }
exports.handler = event => {
    return '';
}
// exports.handler = async (event) => {
//     try {
//         const query = gql`query ListHoldings(
//             $filter: ModelHoldingFilterInput
//             $limit: Int
//             $nextToken: String
//           ) {
//             listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
//               items {
//                 id
//                 symbol
//                 price
//                 quantity
//                 comments
//                 owner
//                 createdAt
//                 updatedAt
//                 portfolio {
//                   id
//                   name
//                   createdAt
//                   updatedAt
//                   owner
//                 }
//               }
//               nextToken
//             }
//           }
//         `;
    
//         // const client = await graphqlClient.hydrated();
//         // const { data } = await client.query({
//         //     query,
//         //     variables: { limit: 1000, filter: { owner: { eq: event.identity.claims['sub'] } } },
//         // });
//         const data = { listHoldings: { items: [] } }
//         const symbols = [...new Set(data.listHoldings.items.map(holding => holding.symbol))];
    
//         if (!symbols.length) {
//             return JSON.stringify([]);
//         }
    
//         const chunkedSymbols = symbols.reduce((resultArray, item, index) => {
//             const chunkIndex = Math.floor(index / 50);
    
//             if (!resultArray[chunkIndex]) {
//                 resultArray[chunkIndex] = [];
//             }
    
//             resultArray[chunkIndex].push(item);
//             return resultArray;
//         }, []);

//         const benzingaData = {};

//         for (const chunkedItems of chunkedSymbols) {
//             const { data } = await axios.get(`https://api.benzinga.com/api/v2.1/calendar/dividends?token=${process.env.BENZINGA_TOKEN}&parameters[tickers]=${replaceAll(chunkedItems.join(','), '-', '/')}`);
//             if (data['dividends']) {
//                 for (const result of data['dividends']) {
//                     benzingaData[result.ticker] = [
//                         ...benzingaData[result.ticker] || [],
//                         result
//                     ];
//                 }
//             }
//         }

//         const list = [];
//         data.listHoldings.items.forEach(e => {
//             const benzingaItemsArray = benzingaData[e.symbol];

//             if (benzingaItemsArray?.length) {
//                 benzingaItemsArray.forEach(benzingaItem => {
//                     if (benzingaItem) {
//                         const { dividend, payable_date, ticker, ...rest } = benzingaItem;
//                         const amount = formatNumber(Number(e.quantity) * Number(dividend));

//                         list.push({
//                             ...e,
//                             ...rest,
//                             quantity: e.quantity,
//                             allDay: true,
//                             title: `${ticker} $${amount}`,
//                             symbol: e.symbol,
//                             id: `${e.id} $${payable_date}`,
//                             start: payable_date,
//                             paymentDate: payable_date,
//                             extendedProps: { amount },
//                         });
//                     }
//                 });
//             }
//         });

//         return JSON.stringify(list);
//     } catch (error) {
//         console.log(error);
//         return JSON.stringify([]);
//     }
// };
