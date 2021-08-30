import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import MarketValueGrid from './MarketValueGrid';
import CostBasis from './CostBasis';
import DividendsAllocation from './DividendsAllocation';
import PortfolioAllocation from './PortfolioAllocation';
import TotalDividends from './TotalDividends';
import MarketValue from './MarketValue';
import DividendsGrid from './DividendsGrid';
import UnrealizedGain from './UnrealizedGain';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
  }
}));

export default () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title='Dashboard'>
      <Container maxWidth={false}>
        <Header />
        <Grid container spacing={3}>
          <Grid item lg={3} md={6} xs={12}>
            <TotalDividends />
          </Grid>
          <Grid item lg={3} md={6} xs={12}>
            <CostBasis />
          </Grid>
          <Grid item lg={3} md={6} xs={12}>
            <UnrealizedGain />
          </Grid>
          <Grid item lg={3} md={6} xs={12}>
            <MarketValue />
          </Grid>
          <Grid item lg={8} xs={12}>
            <PortfolioAllocation />
          </Grid>
          <Grid item lg={4} xs={12}>
            <MarketValueGrid />
          </Grid>
          <Grid item lg={4} xs={12}>
            <DividendsGrid />
          </Grid>
          <Grid item lg={8} xs={12}>
            <DividendsAllocation />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
