import React, {
  useState,
  useEffect,
} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Charts from './Charts';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 600,
  },
}));

export default ({ className, data, totalDividends, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [labels, setLabels] = useState([]);
  const [percentagesOfDividends, setPercentagesOfDividends] = useState([]);

  useEffect(() => {
    const _labels = [];
    const _percentagesOfPortfolio = [];

    if (isMountedRef.current && totalDividends > 0) {
      data.forEach((holding) => {
        const percentageOfDividends = Number((Number(holding.totalDividends) / Number(totalDividends)) * 100).toFixed(1);
        if (percentageOfDividends > 0) {
          _labels.push(holding.symbol);
          _percentagesOfPortfolio.push(percentageOfDividends);
        }
      });

      setLabels(_labels);
      setPercentagesOfDividends(_percentagesOfPortfolio);
    }
  }, [isMountedRef, data, totalDividends]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title='Dividends Allocation' />
      <Divider />
      <PerfectScrollbar>
        <Box p={3} className={classes.chart}>
          <Charts
            type='bar'
            labels={labels}
            data={percentagesOfDividends}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};


