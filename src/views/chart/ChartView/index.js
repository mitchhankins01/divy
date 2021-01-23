import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ChartView = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  
  return (
    <Page
      className={classes.root}
      title="Chart"
    >
      <Container maxWidth={false}>
        {/* <Header /> */}
        <Box>
          <Chart symbol='sp500' />
        </Box>
      </Container>
    </Page>
  );
};

export default ChartView;
