import React, { useState, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  TextField,
  makeStyles,
  Chip,
  useTheme
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import { DataGrid } from '@material-ui/data-grid';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { buyColor, sellColor } from '../../../theme';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 74,
    left: 266,
    bottom: 10,
    right: 10,
    [theme.breakpoints.down('md')]: {
      left: 0
    },
    
  },
  dark: {
    test: theme.palette.type === 'dark' ? 'dark' : 'light'
  },
}));

export default ({
  className,
  ticker,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card
      {...rest}
    >
      <div
      className={clsx(classes.root, className)}>
      {/* <div style={{ height: 'calc(100vh - 170px)' }}> */}
        <TradingViewWidget
          symbol={ticker.toUpperCase()}
          theme={theme.palette.type === 'dark' ? Themes.DARK : Themes.LIGHT}
          autosize={true}
          // watchlist={['AAPL', 'MSFT', 'TWTR']}
          // hide_side_toolbar={false}
          // withdateranges={true}
          // details={true}
        />
      </div>
    </Card>
  );
};

