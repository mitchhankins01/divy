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
import formatter from '../../../utils/numberFormatter';
import useAuth from 'src/hooks/useAuth';
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

export default ({ className, ...rest }) => {
  const classes = useStyles();
  const { listStatistics: { costBasis } } = useAuth();

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
          Cost Basis
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
            {formatter.format(costBasis)}
          </Typography>
        </Box>
      </Box>
      <Avatar className={classes.avatar}>
        <HistoryIcon />
      </Avatar>
    </Card>
  );
};

