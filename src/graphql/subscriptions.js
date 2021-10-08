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
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding($owner: String) {
    onCreateHolding(owner: $owner) {
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
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding($owner: String) {
    onUpdateHolding(owner: $owner) {
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
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding($owner: String) {
    onDeleteHolding(owner: $owner) {
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
