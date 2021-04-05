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
    for (const { symbol, quantity } of data.holdingsByOwner.items) {
        try {
            const { data } = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/dividends/next?token=pk_2d68b4fe291941b99ab69c2f105fa629`);

            if (data.length) {
                list.push({
                    ...data[0],
                    quantity,
                    allDay: true,
                    title: symbol,
                    start: data[0].paymentDate,
                    extendedProps: {
                        amount: Number(quantity) * Number(data[0].amount)
                    },
                });
            }
        } catch (error) {
            if (error.response.data === 'Unknown symbol') {
                list.push({ title: 'warning', description: `Symbol ${symbol} not found.` });
            } else {
                res.json({ success: false });
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