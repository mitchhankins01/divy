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
  iconOne: {
    transform: 'rotate(15deg)',
    fontSize: ({ rem }) => `${rem}em`,
  },
  iconTwo: {
    transform: 'rotate(10deg)',
    fontSize: ({ rem }) => `${rem * 1.75}em`,
  },
  iconThree: {
    // transform: 'rotate(-20deg)',
    fontSize: ({ rem }) => `${rem * 2.5}em`,
    marginLeft: -6,
  },
  span: {
    fontSize: ({ rem }) => `${rem * 2.5}em`,
    textDecoration: 'none',
    color: ({ forceDark }) =>
      name === THEMES.DARK || forceDark ? palette.secondary.main : palette.primary.contrastText,
  },
}));

const Logo = ({ rem = 1, forceDark = false, ...rest }) => {
  const classes = useStyles({ rem, forceDark });

  return (
    <div className={classes.div}>
      <span className={classes.icons} >
        <AttachMoneyIcon className={classes.iconOne} />
        <AttachMoneyIcon className={classes.iconTwo} />
        <AttachMoneyIcon className={classes.iconThree} />
      </span>
      <span className={classes.span}>Divy</span>
    </div>
  );
}

export default Logo;
