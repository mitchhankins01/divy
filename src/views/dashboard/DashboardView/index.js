import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import LatestProjects from './LatestProjects';
import CostBasis from './CostBasis';
import MonthlyOverview from './MonthlyOverview';
import Allocation from './Allocation';
import MarketValue from './MarketValue';
import IncomeThisMonth from './IncomeThisMonth';
import TeamTasks from './TeamTasks';
import UnrealizedGain from './UnrealizedGain';
import { listStatistics } from '../../../graphql/queries';

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
  const isMountedRef = useIsMountedRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [costBasis, setCostBasis] = useState(0);
  const [marketValue, setMarketValue] = useState(0);

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.graphql(graphqlOperation(listStatistics));

      if (isMountedRef.current) {
        const parsed = JSON.parse(data.listStatistics);
        console.log('parsed', parsed)
        setData(parsed);

        // calculate market value and cost basis
        let _costBasis = 0;
        let _marketValue = 0;
        parsed.forEach(holding => {
          _costBasis += holding.quantity * holding.buyPrice;
          _marketValue += holding.quantity * holding.marketPrice;
        });
        setCostBasis(_costBasis);
        setMarketValue(_marketValue);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);


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
          {/* <Grid
            item
            lg={3}
            sm={6}
            xs={12}
          >
            <IncomeThisMonth />
          </Grid> */}
          <Grid
            item
            lg={4}
            sm={4}
            xs={12}
          >
            <CostBasis costBasis={costBasis} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={12}
          >
            <UnrealizedGain marketValue={marketValue} costBasis={costBasis} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={12}
          >
            <MarketValue marketValue={marketValue} />
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
