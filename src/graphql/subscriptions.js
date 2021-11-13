/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStripeEvent = /* GraphQL */ `
  subscription OnCreateStripeEvent {
    onCreateStripeEvent {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStripeEvent = /* GraphQL */ `
  subscription OnUpdateStripeEvent {
    onUpdateStripeEvent {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStripeEvent = /* GraphQL */ `
  subscription OnDeleteStripeEvent {
    onDeleteStripeEvent {
      id
      type
      message
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePortfolio = /* GraphQL */ `
  subscription OnCreatePortfolio($owner: String) {
    onCreatePortfolio(owner: $owner) {
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
export const onUpdatePortfolio = /* GraphQL */ `
  subscription OnUpdatePortfolio($owner: String) {
    onUpdatePortfolio(owner: $owner) {
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
export const onDeletePortfolio = /* GraphQL */ `
  subscription OnDeletePortfolio($owner: String) {
    onDeletePortfolio(owner: $owner) {
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
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding($owner: String) {
    onCreateHolding(owner: $owner) {
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
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding($owner: String) {
    onUpdateHolding(owner: $owner) {
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
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding($owner: String) {
    onDeleteHolding(owner: $owner) {
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
