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
  useTheme
} from '@material-ui/core';
import { Pie } from 'react-chartjs-2';
import "chartjs-plugin-piechart-outlabels";
import palette from 'google-palette';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 600,
  },
}));

export default ({ className, data, marketValue, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [labels, setLabels] = useState([]);
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

  const options = {
    responsive: true,
    cutoutPercentage: 10,
    zoomOutPercentage: 80,
    maintainAspectRatio: false,
    layout: { padding: 150, },
    legend: {  display: false, position: 'left' },
    plugins: {
      outlabels: {
        color: "black",
        text: ({ dataset, dataIndex, labels }) => {
          return `${labels[dataIndex]} ${dataset.data[dataIndex]}%`
        },
      }
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title='Portfolio Allocation' />
      <Divider />
      <PerfectScrollbar>
        <Box p={3} className={classes.chart}>
          <Pie
            options={options}
            data={{
              labels: labels,
              datasets: [
                {
                  data: percentagesOfPortfolio,
                  borderWidth: 2,
                  borderColor: theme.palette.background.default,
                  hoverBorderColor: theme.palette.background.default,
                  backgroundColor: palette(['tol-dv'], percentagesOfPortfolio.length).map(function (hex) {
                    return '#' + hex;
                  }),
                }
              ],
            }}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};


