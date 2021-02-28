import React from 'react';
import clsx from 'clsx';
import {
  Card,
  makeStyles,
  useTheme
} from '@material-ui/core';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 64,
    left: 256,
    bottom: 0,
    right: 0,
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

