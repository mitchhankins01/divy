require('cross-fetch/polyfill');
const gql = require('graphql-tag');

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

module.exports = {
    chunkArray,
    holdingsByOwnerQuery,
    addHoldingMutation,
    updateHoldingMutation,
}