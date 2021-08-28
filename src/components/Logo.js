import React from 'react';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from '@material-ui/core';
import { THEMES } from 'src/constants';

const useStyles = makeStyles(({ name, palette }) => ({
  div: {
    display: 'flex',
    alignItems: 'center',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    justifyContent: 'space-around',
    fontSize: ({ rem }) => `${rem}rem`,
    color: ({ forceDark }) => 
      name === THEMES.DARK || forceDark ? palette.secondary.main : palette.primary.contrastText,

  },
  span: {
    textDecoration: 'none',
    fontSize: ({ rem }) => `${rem * 2.3}rem`,
    color: ({ forceDark }) => 
      name === THEMES.DARK || forceDark ? palette.secondary.main : palette.primary.contrastText,
  },
}));

const Logo = ({ rem = 1, forceDark = false, ...rest }) => {
  const classes = useStyles({ rem, forceDark });

  return (
    <div className={classes.div}>
      <span className={classes.icons} >
        <AttachMoneyIcon
          {...rest}
          style={{
            transform: 'rotate(-10deg)',
            padding: 0,
            fontSize: '1em',
            marginRight: 2.5
          }}
        />
        <AttachMoneyIcon
          {...rest}
          style={{
            transform: 'rotate(-15deg)',
            padding: 0, fontSize: '2.25em',
            marginLeft: -2.5,
            marginRight: -6
          }}
        />
        <AttachMoneyIcon
          {...rest}
          style={{
            transform: 'rotate(-20deg)',
            padding: 0,
            fontSize: '3.5em',
            marginLeft: -6
          }}
        />
      </span>
      <span className={classes.span}>Divy</span>
    </div>
  );
}

export default Logo;
