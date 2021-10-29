import React, {
  useState,
  useEffect,
} from 'react';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Charts from './Charts';
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 750,
  },
}));

export default ({ className, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [labels, setLabels] = useState([]);
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [percentagesOfPortfolio, setPercentagesOfPortfolio] = useState([]);
  const [chartType, setChartType] = useState('pie');
  const { listStatistics: { sortedMarketValueData, marketValue } } = useData();

  useEffect(() => {
    const _labels = [];
    const _percentagesOfPortfolio = [];

    if (isMountedRef.current && marketValue > 0) {
      sortedMarketValueData.forEach((holding, index) => {
        if (index <= 50) {
          const percentageOfPortfolio = Number((Number(holding.marketValue) / Number(marketValue)) * 100).toFixed(1);
          _labels.push(holding.symbol);
          _percentagesOfPortfolio.push(percentageOfPortfolio);
        }
      });

      setLabels(_labels);
      setPercentagesOfPortfolio(_percentagesOfPortfolio);
    }
  }, [isMountedRef, sortedMarketValueData, marketValue]);

  useEffect(() => {
    if (isMobileDevice) {
      setChartType('horizontalBar')
    }
  }, [isMobileDevice]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title={`Portfolio Allocation ${labels.length > 49 ? '(Top 50)' : ''}`}
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
        <Box p={0} className={classes.chart}>
          <Charts
            labels={labels}
            type={chartType}
            data={percentagesOfPortfolio}
          />
        </Box>
    </Card>
  );
};


