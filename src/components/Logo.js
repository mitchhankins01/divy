import React from 'react';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Typography } from '@material-ui/core';
const Logo = (props) => {

  return (
    <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
      <AttachMoneyIcon {...props} color='primary' fontSize='large' />
      <Typography
          variant="h3"
          color="textPrimary"
        >
          Divy
        </Typography>
      </span>
  )
  return (
    <img
      alt="Logo"
      src="/static/logo.svg"
      {...props}
    />
  );
}

export default Logo;
