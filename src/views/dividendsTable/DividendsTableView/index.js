import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Button,
  Container,
  useTheme,
  useMediaQuery,
  makeStyles,
  Box,
  Card,
} from '@material-ui/core';
import { useDebounce } from 'use-debounce';
import { DataGrid } from '@material-ui/data-grid';
import { Link as RouterLink } from 'react-router-dom';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API, graphqlOperation, Cache } from 'aws-amplify';
import Page from 'src/components/Page';
import Header from './Header';
import { listDividends } from '../../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    // minHeight: '100%',
    paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3)
  },
  // queryField: {
  //   width: 500
  // }
}));

const formatNumber = number => {
  if (isNaN(Number(number))) {
    return (0).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  return Number(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default () => {
  const theme = useTheme();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.graphql(graphqlOperation(listDividends));

      if (isMountedRef.current) {
        const parsed = JSON.parse(data.listDividends);
        setEvents(parsed);
        Cache.setItem('listDividends', parsed);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    // const cached = Cache.getItem('listDividends');
    const cached = false;

    if (cached) {
      setEvents(cached);
    } else {
      getEvents();
    }
  }, [getEvents]);

  const handleSearchChange = (event) => {
    event.persist();
    setSearch(String(event.target.value).toUpperCase());
  };

  const handleClearSearch = (event) => {
    event.persist();
    setSearch('');
  };

  const columns = [
    { headerName: 'Amount', field: 'amount', flex: 1, align: 'right', valueGetter: params => `$${formatNumber(params.row.extendedProps.amount)}`, hide: mobileDevice && true },
    {
      headerName: 'Symbol', field: 'symbol', flex: 1, renderCell: cell => (
        <Button
          style={{ justifyContent: "flex-start", textTransform: 'none', padding: 15 }}
          fullWidth
          component={RouterLink}
          to={`/app/chart/${cell.value}`}
        >
          {cell.value}
        </Button>
      )
    },
    // { headerName: 'Amount', field: 'amount', flex: 1, valueGetter: params => `$${params.row.extendedProps.amount}`, hide: mobileDevice && true },
    { headerName: 'Pay Date', field: 'paymentDate', flex: 1, valueGetter: params => params.row.paymentDate, hide: mobileDevice && true },
    { headerName: 'Ex Date', field: 'exDate', flex: 1, valueGetter: params => params.row.ex_dividend_date, hide: mobileDevice && true },
    { headerName: 'Declared Date', field: 'declared', flex: 1, valueGetter: params => params.row.declaredDate, hide: mobileDevice && true },
    { headerName: 'Record Date', field: 'recordDate', flex: 1, valueGetter: params => params.row.record_date, hide: mobileDevice && true },
  ];

  return (
    <Page className={classes.root} title='Dividends List'>
      <Container >
        <Header handleClearSearch={handleClearSearch} handleSearchChange={handleSearchChange} search={search} />
        <Box mt={3}>
          <Card>
            <Box style={{ minnHeight: '70vh', height: 'calc(100vh - 200px' }}>
              <DataGrid
                rows={events}
                columns={columns}
                autoPageSize={true}
                loading={loading}
                sortModel={[{ field: 'paymentDate', sort: 'asc' }]}
                filterModel={{
                  items: [{ columnField: 'symbol', operatorValue: 'contains', value: debouncedSearch }],
                }}
              />
            </Box>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

