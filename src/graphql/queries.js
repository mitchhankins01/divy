/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listDividends = /* GraphQL */ `
  query ListDividends {
    listDividends
  }
`;
export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
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
export const listHoldings = /* GraphQL */ `
  query ListHoldings(
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
      }
      nextToken
    }
  }
`;
export const holdingsByOwner = /* GraphQL */ `
  query HoldingsByOwner(
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
  }
`;
