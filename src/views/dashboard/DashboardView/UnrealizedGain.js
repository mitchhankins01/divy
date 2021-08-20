import React from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
// import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

export default ({ className, marketValue, costBasis, ...rest }) => {
  const classes = useStyles();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const gain = marketValue - costBasis;
  const difference = Math.round((gain / costBasis) * 100);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box flexGrow={1}>
        <Typography
          component="h3"
          gutterBottom
          variant="overline"
          color="textSecondary"
        >
          Unrealized Gain
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant="h3"
            color="textPrimary"
          >
            {formatter.format(gain)}
          </Typography>
          <Label
            className={classes.label}
            color={gain > 0 ? 'success' : 'error'}
          >
            {difference > 0 ? '+' : ''}
            {difference}
            %
          </Label>
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <TrendingUpIcon />
      </Avatar>
    </Card>
  );
};
