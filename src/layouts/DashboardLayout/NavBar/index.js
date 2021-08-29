/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  User as UserIcon,
  DollarSign as DollarSignIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
  Upload
} from 'react-feather';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ShowChartIcon from '@material-ui/icons/Timeline';
import Logo from 'src/components/Logo';
// import useAuth from 'src/hooks/useAuth';
import NavItem from './NavItem';

const sections = [
  {
    subheader: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: DashboardIcon,
        href: '/app/dashboard'
      },
    ]
  },
  {
    subheader: 'Dividends',
    items: [
      {
        title: 'List',
        icon: ListIcon,
        href: '/app/dividends/list'
      },
      {
        title: 'Calendar',
        icon: CalendarIcon,
        href: '/app/dividends/calendar'
      },
    ]
  },
  {
    subheader: 'Portfolio',
    items: [
      {
        title: 'Holdings',
        href: '/app/holdings',
        icon: ListIcon
      },
      {
        title: 'Bulk',
        href: '/app/holdings/bulk',
        icon: Upload
      },
      {
        title: 'Chart',
        href: '/app/chart/aapl',
        icon: ShowChartIcon
      },
    ]
  },
  {
    subheader: 'Miscellaneous',
    items: [
      {
        title: 'Account',
        href: '/app/account',
        icon: UserIcon
      },
      {
        title: 'Pricing',
        href: '/pricing',
        icon: DollarSignIcon
      }
    ]
  },
];

function renderNavItems({
  items,
  pathname,
  depth = 0
}) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  // const { user } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box
            p={2}
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="center"
          >
            {/* <RouterLink to="/app/account"> */}
              <Avatar
                alt="User"
                className={classes.avatar}
                // src={user.avatar}
              >
                {/* KK */}
                <PersonIcon fontSize='large' />
              </Avatar>
            {/* </RouterLink> */}
          </Box>
          <Box
            mt={2}
            textAlign="center"
          >
            <Link
              component={RouterLink}
              to="/app/account"
              variant="h5"
              color="textPrimary"
              underline="none"
            >
              {/* {'user.name'} */}
              Kurt Weiss
            </Link>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              Premier User
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box p={2}>
          {sections.map((section) => (
            <List
              key={section.subheader}
              subheader={(
                <ListSubheader
                  disableGutters
                  disableSticky
                >
                  {section.subheader}
                </ListSubheader>
              )}
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname
              })}
            </List>
          ))}
        </Box>
        <Divider />
        <Box p={2}>
          <Box
            p={2}
            borderRadius="borderRadius"
            bgcolor="background.dark"
          >
            <Typography
              variant="h6"
              color="textPrimary"
            >
              Free Version
            </Typography>
            <Link
              variant="subtitle1"
              color="secondary"
              component={RouterLink}
              to="/docs"
            >
              Upgrade to Pro
            </Link>
          </Box>
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
