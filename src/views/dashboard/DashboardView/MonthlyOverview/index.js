import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import Chart from './Chart';

const useStyles = makeStyles(() => ({
  root: {},
  chart: {
    height: 400
  }
}));

const FinancialStats = ({ className, ...rest }) => {
  const classes = useStyles();
  const stats = [642.23, 356.93, 792.32, 483.23, 519.32, 657.23, 498.67, 281.33, 581.91, 765.78, 322.80, 626.94];
  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Monthly Payments"
      />
      <Divider />
      <PerfectScrollbar>
        <Box
          minWidth={700}
          pt={4}
          pr={2}
          pl={2}
        >
          <Chart
            className={classes.chart}
            data={stats}
            labels={labels}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default FinancialStats;
