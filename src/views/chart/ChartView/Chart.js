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
  root: {},
  dark: {
    test: theme.palette.type === 'dark' ? 'dark' : 'light'
  }
}));

export default ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [test, setTest] = React.useState('dark')

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
    <button onClick={() => setTest('light')}>CLick</button>
      <div style={{ height: 'calc(100vh - 170px)' }}>
        <TradingViewWidget
          symbol="NASDAQ:AAPL"
          // theme={theme.palette.type === 'dark' ? Themes.DARK : Themes.LIGHT}
          theme={test === 'dark' ? Themes.DARK : Themes.LIGHT}
          autosize={true}
          watchlist={['AAPL', 'MSFT', 'TWTR']}
          // hide_side_toolbar={false}
          withdateranges={true}
          details={true}
        />
      </div>
    </Card>
  );
};

