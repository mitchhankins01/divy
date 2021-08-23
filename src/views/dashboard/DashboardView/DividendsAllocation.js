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
import { Pie, Bar, HorizontalBar } from 'react-chartjs-2';
import "chartjs-plugin-piechart-outlabels";
import palette from 'google-palette';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 600,
  },
}));

export default ({ className, data, marketValue, totalDividends, ...rest }) => {
  const theme = useTheme();
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false, position: 'left' },
    scales: { xAxes: [{ ticks: { callback: value => `${value}%` } }] },
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title='Dividends Allocation' />
      <Divider />
      <PerfectScrollbar>
        <Box p={3} className={classes.chart}>
          <HorizontalBar
            options={options}
            data={{
              labels: labels,
              datasets: [
                {
                  data: percentagesOfDividends,
                  borderWidth: 2,
                  borderColor: theme.palette.background.default,
                  hoverBorderColor: theme.palette.background.default,
                  backgroundColor: palette(['tol-dv'], percentagesOfDividends.length).map(function (hex) {
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


