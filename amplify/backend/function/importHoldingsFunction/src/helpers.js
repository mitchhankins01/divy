require('cross-fetch/polyfill');
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;

const chunkArray = sourceArray => {
    return sourceArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 45);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
};

const holdingsByOwnerQuery = gql`query HoldingsByOwner(
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

const addHoldingMutation = gql`mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
) {
    createHolding(input: $input, condition: $condition) {
    id
    symbol
    price
    quantity
    comments
    owner
    createdAt
    updatedAt
    }
}
`;

const updateHoldingMutation = gql`mutation UpdateHolding(
$input: UpdateHoldingInput!
$condition: ModelHoldingConditionInput
) {
updateHolding(input: $input, condition: $condition) {
  id
  symbol
  price
  quantity
  comments
  owner
  createdAt
  updatedAt
}
}
`;

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

module.exports = {
    chunkArray,
    holdingsByOwnerQuery,
    addHoldingMutation,
    updateHoldingMutation,
    graphqlClient
}