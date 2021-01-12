import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import clsx from 'clsx';
import { useTheme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  }
}));

const Chart = ({ data: dataProp, className, ...rest }) => {
  const theme = useTheme();
  const classes = useStyles();

  const data = {
    datasets: dataProp.datasets.map(((dataset) => ({
      ...dataset,
      borderWidth: 8,
      borderColor: theme.palette.background.default,
      hoverBorderColor: theme.palette.background.default
    }))),
    labels: dataProp.labels
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    // cutoutPercentage: 80,
    legend: {
      display: true
    },
    layout: {
      padding: 0
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      caretSize: 10,
      yPadding: 20,
      xPadding: 20,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.background.dark,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary,
      callbacks: {
        label(tooltipItem, _data) {
          const label = _data.labels[tooltipItem.index];
          const value = _data.datasets[0].data[tooltipItem.index];

          return `${label}: ${value}%`;
        }
      }
    }
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Pie
        data={data}
        options={options}
        {...rest}
      />
    </div>
  );
};

Chart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};

export default Chart;
