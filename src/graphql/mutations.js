/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStripeEvent = /* GraphQL */ `
  mutation CreateStripeEvent(
    $input: CreateStripeEventInput!
    $condition: ModelStripeEventConditionInput
  ) {
    createStripeEvent(input: $input, condition: $condition) {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const updateStripeEvent = /* GraphQL */ `
  mutation UpdateStripeEvent(
    $input: UpdateStripeEventInput!
    $condition: ModelStripeEventConditionInput
  ) {
    updateStripeEvent(input: $input, condition: $condition) {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const deleteStripeEvent = /* GraphQL */ `
  mutation DeleteStripeEvent(
    $input: DeleteStripeEventInput!
    $condition: ModelStripeEventConditionInput
  ) {
    deleteStripeEvent(input: $input, condition: $condition) {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const createPortfolio = /* GraphQL */ `
  mutation CreatePortfolio(
    $input: CreatePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    createPortfolio(input: $input, condition: $condition) {
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
export const updatePortfolio = /* GraphQL */ `
  mutation UpdatePortfolio(
    $input: UpdatePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    updatePortfolio(input: $input, condition: $condition) {
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
export const deletePortfolio = /* GraphQL */ `
  mutation DeletePortfolio(
    $input: DeletePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    deletePortfolio(input: $input, condition: $condition) {
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
export const createHolding = /* GraphQL */ `
  mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    createHolding(input: $input, condition: $condition) {
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
export const updateHolding = /* GraphQL */ `
  mutation UpdateHolding(
    $input: UpdateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    updateHolding(input: $input, condition: $condition) {
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
export const deleteHolding = /* GraphQL */ `
  mutation DeleteHolding(
    $input: DeleteHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    deleteHolding(input: $input, condition: $condition) {
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
