import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import Logo from 'src/components/Logo';
import Dashboard from '@material-ui/icons/Dashboard';
import { THEMES } from 'src/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.type === 'dark' && 'white',
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ? {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main
    } : {},
    ...theme.name === THEMES.DOLLAR_DARK ? {
      backgroundColor: theme.palette.background.default
    } : {}
  },
  toolbar: {
    minHeight: 64
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      color="default"
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Logo className={classes.logo} />
        </RouterLink>
        <Box flexGrow={1} />
        <Divider className={classes.divider} />
        <Button
          color="secondary"
          component="a"
          startIcon={<Dashboard />}
          href='/app/dashboard'
          variant="contained"
          size="small"
        >
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
