/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listDividends = /* GraphQL */ `
  query ListDividends {
    listDividends
  }
`;
export const listStatistics = /* GraphQL */ `
  query ListStatistics {
    listStatistics
  }
`;
export const querySymbol = /* GraphQL */ `
  query QuerySymbol($symbol: String!) {
    querySymbol(symbol: $symbol) {
      exchange
      shortname
      quoteType
      symbol
      index
      score
      typeDisp
      longname
      label
    }
  }
`;
export const importHoldings = /* GraphQL */ `
  query ImportHoldings(
    $type: String!
    $fileKey: String!
    $selectedPortfolioId: String!
  ) {
    importHoldings(
      type: $type
      fileKey: $fileKey
      selectedPortfolioId: $selectedPortfolioId
    ) {
      failSymbols {
        id
        symbol
        reason
      }
      newSymbols {
        id
        symbol
        numberOfShares
        pricePerShare
        comments
      }
      updateSymbols {
        id
        symbol
        numberOfShares
        pricePerShare
        reason
      }
    }
  }
`;
export const getStripeEvent = /* GraphQL */ `
  query GetStripeEvent($id: ID!) {
    getStripeEvent(id: $id) {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const listStripeEvents = /* GraphQL */ `
  query ListStripeEvents(
    $filter: ModelStripeEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStripeEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPortfolio = /* GraphQL */ `
  query GetPortfolio($id: ID!) {
    getPortfolio(id: $id) {
      id
      name
      owner
      createdAt
      updatedAt
      holdings {
        items {
          id
          portfolioID
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
  }
`;
export const listPortfolios = /* GraphQL */ `
  query ListPortfolios(
    $filter: ModelPortfolioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPortfolios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        createdAt
        updatedAt
        holdings {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
      id
      portfolioID
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
        owner
        createdAt
        updatedAt
        holdings {
          nextToken
        }
      }
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
        portfolioID
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
          owner
          createdAt
          updatedAt
        }
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
        portfolioID
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
          owner
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
