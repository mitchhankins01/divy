import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import LatestProjects from './LatestProjects';
import TotalDividends from './TotalDividends';
import MonthlyOverview from './MonthlyOverview';
import Allocation from './Allocation';
import MarketValue from './MarketValue';
import IncomeThisMonth from './IncomeThisMonth';
import TeamTasks from './TeamTasks';
import UnrealizedGain from './UnrealizedGain';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DashboardView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Header />
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
          >
            <IncomeThisMonth />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalDividends />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
          >
            <UnrealizedGain />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
          >
            <MarketValue />
          </Grid>
          <Grid
            item
            lg={9}
            xs={12}
          >
            <MonthlyOverview />
          </Grid>
          <Grid
            item
            lg={3}
            xs={12}
          >
            <Allocation />
          </Grid>
          <Grid
            item
            lg={5}
            xl={4}
            xs={12}
          >
            <TeamTasks />
          </Grid>
          <Grid
            item
            lg={7}
            xl={8}
            xs={12}
          >
            <LatestProjects />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;
