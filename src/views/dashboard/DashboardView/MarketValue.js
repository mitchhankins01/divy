import React from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';
import formatter from '../../../utils/numberFormatter';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatar: {
    backgroundColor: theme.palette.secondary.contrastText,
    color: theme.palette.secondary.main,
    height: 48,
    width: 48
  }
}));

export default ({ className, ...rest }) => {
  const classes = useStyles();
  const { listStatistics: { marketValue } } = useAuth();
  
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box flexGrow={1}>
        <Typography
          color="inherit"
          component="h3"
          gutterBottom
          variant="overline"
        >
          Market Value
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            color="inherit"
            variant="h3"
          >
            {formatter.format(marketValue)}
          </Typography>
        </Box>
      </Box>
      <Avatar
        className={classes.avatar}
        color="inherit"
      >
        <StorefrontIcon />
      </Avatar>
    </Card>
  );
};
