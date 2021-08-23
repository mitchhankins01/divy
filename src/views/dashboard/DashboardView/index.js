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
import MarketValueGrid from './MarketValueGrid';
import CostBasis from './CostBasis';
import DividendsAllocation from './DividendsAllocation';
import PortfolioAllocation from './PortfolioAllocation';
import TotalDividends from './TotalDividends';
import MarketValue from './MarketValue';
import DividendsGrid from './DividendsGrid';
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
  const [totalDividends, setTotalDividends] = useState(0);

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
        let _totalDividends = 0;
        parsed.forEach(holding => {
          _costBasis += holding.costBasis;
          _marketValue += holding.marketValue;
          _totalDividends += holding.totalDividends;
        });
        setCostBasis(_costBasis);
        setMarketValue(_marketValue);
        setTotalDividends(_totalDividends);
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
          <Grid
            item
            lg={3}
            md={6}
            sm={12}
          >
            <TotalDividends totalDividends={totalDividends} />
          </Grid>
          <Grid
            item
            lg={3}
            md={6}
            sm={12}
          >
            <CostBasis costBasis={costBasis} />
          </Grid>
          <Grid
            item
            lg={3}
            md={6}
            sm={12}
          >
            <UnrealizedGain marketValue={marketValue} costBasis={costBasis} />
          </Grid>
          <Grid
            item
            lg={3}
            md={6}
            sm={12}
          >
            <MarketValue marketValue={marketValue} />
          </Grid>
          <Grid
            item
            lg={8}
            xs={12}
          >
            <PortfolioAllocation data={data} marketValue={marketValue} />
          </Grid>
          <Grid
            item
            lg={4}
            xs={12}
          >
            <MarketValueGrid data={data} marketValue={marketValue} />
          </Grid>
          <Grid
            item
            lg={4}
            xs={12}
          >
            <DividendsGrid data={data} totalDividends={totalDividends} />
          </Grid>
          <Grid
            item
            lg={8}
            xs={12}
          >
            <DividendsAllocation data={data} totalDividends={totalDividends} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DashboardView;
