import React from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default ({ children }) => {
  const { isAuthenticated, attributes, SUBSCRIPTIONS } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!Object.keys(SUBSCRIPTIONS).includes(attributes['custom:subscription'])) {
    return <Redirect to="/pricing" />;
  }

  return (
    <>
      {children}
    </>
  );
};
