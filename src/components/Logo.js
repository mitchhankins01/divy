import React from 'react';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  span: {
    color: theme.palette.type === 'dark' ? theme.palette.secondary.main : 'white',
    // fontSize: '2.5rem',
    textDecoration: 'none'
  },
  icon: {
    color: theme.palette.type === 'dark' ? theme.palette.secondary.main : 'white'
  },
  div: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const Logo = ({ rem = 1, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <span style={{ fontSize: `${rem}rem`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', textDecoration: 'none' }}>
        <AttachMoneyIcon {...rest} className={classes.icon} style={{ transform: 'rotate(-10deg)', padding: 0, fontSize: '1em', marginRight: 2.5 }} />
        <AttachMoneyIcon {...rest} className={classes.icon} style={{ transform: 'rotate(-15deg)', padding: 0, fontSize: '2.25em', marginLeft: -2.5, marginRight: -6 }} />
        <AttachMoneyIcon {...rest} className={classes.icon} style={{ transform: 'rotate(-20deg)', padding: 0, fontSize: '3.5em', marginLeft: -6 }} />
      </span>
      <span style={{ fontSize: `${rem * 2.3}rem`}} className={classes.span}>Divy</span>
    </div>
  );
}

export default Logo;
