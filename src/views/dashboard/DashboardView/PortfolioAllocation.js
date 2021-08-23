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
  Select,
  MenuItem,
} from '@material-ui/core';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Charts from './Charts';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 600,
  },
}));

export default ({ className, data, marketValue, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [labels, setLabels] = useState([]);
  const [chartType, setChartType] = useState('pie');
  const [percentagesOfPortfolio, setPercentagesOfPortfolio] = useState([]);

  useEffect(() => {
    const _labels = [];
    const _percentagesOfPortfolio = [];

    if (isMountedRef.current && marketValue > 0) {
      data.forEach((holding, i) => {
        const holdingMarketValue = Number(holding.quantity) * Number(holding.marketPrice);
        const percentageOfPortfolio = Number((Number(holdingMarketValue) / Number(marketValue)) * 100).toFixed(1);
        _labels.push(holding.symbol);
        _percentagesOfPortfolio.push(percentageOfPortfolio);
      });

      setLabels(_labels);
      setPercentagesOfPortfolio(_percentagesOfPortfolio);
    }
  }, [isMountedRef, data, marketValue]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title='Portfolio Allocation'
        action={
          <Select value={chartType} onChange={e => setChartType(e.target.value)}>
            <MenuItem value={'pie'}>Pie Chart</MenuItem>
            <MenuItem value={'doughnut'}>Doughnut Chart</MenuItem>
            <MenuItem value={'bar'}>Vertical Bar Chart</MenuItem>
            <MenuItem value={'horizontalBar'}>Horizontal Bar Chart</MenuItem>
          </Select>
        }
      />
      <Divider />
      <PerfectScrollbar>
        <Box p={3} className={classes.chart}>
        <Charts
            labels={labels}
            type={chartType}
            data={percentagesOfPortfolio}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};


