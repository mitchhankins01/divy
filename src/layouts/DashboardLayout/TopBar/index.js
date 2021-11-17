import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon,
  LinearProgress
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Logo from 'src/components/Logo';
import { THEMES } from 'src/constants';
import Account from './Account';
// import Notifications from './Notifications';
// import Search from './Search';
import Settings from './Settings';
import Portfolios from './Portfolios';
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.type === 'dark' && 'white',
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ? {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main
    } : {},
    ...theme.name === THEMES.DARK ? {
      backgroundColor: theme.palette.background.default
    } : {}
  },
  toolbar: {
    minHeight: 64
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const { loading } = useData();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      {...rest}
    >
      {loading && <LinearProgress />}
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Logo />
          </RouterLink>
        </Hidden>
        <Box
          ml={2}
          flexGrow={1}
        />
        {/* <Search /> */}
        {/* <Notifications /> */}
        <Portfolios />
        <Settings />
        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
