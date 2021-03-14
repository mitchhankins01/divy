import React from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';
// import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  // label: {
  //   marginLeft: theme.spacing(1)
  // },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

const TotalDividends = ({ className, ...rest }) => {
  const classes = useStyles();
  const data = {
    value: '7,894.28',
    difference: -10,
    currency: '$',
  };

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
          Total Dividends Received
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
            {data.currency}
            {data.value}
          </Typography>
          {/* <Label
            className={classes.label}
            color={data.difference > 0 ? 'success' : 'error'}
          >
            {data.difference > 0 ? '+' : ''}
            {data.difference}
            %
          </Label> */}
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <HistoryIcon />
      </Avatar>
    </Card>
  );
};

export default TotalDividends;
