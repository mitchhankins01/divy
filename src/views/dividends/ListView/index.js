import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Button,
  useTheme,
  useMediaQuery,
  makeStyles,
  Card,
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { useDebounce } from 'use-debounce';
import { DataGrid } from '@material-ui/data-grid';
import { Link as RouterLink } from 'react-router-dom';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API, graphqlOperation, Cache } from 'aws-amplify';
import Page from 'src/components/Page';
import Header from './Header';
import { listDividends } from '../../../graphql/queries';
import formatter from '../../../utils/numberFormatter';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    }
  },
  header: {
    flex: 1
  },
  card: {
    flex: 10
  }
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const [hidePastDividends, setHidePastDividends] = useState(true);
  const [eventsAfterToday, setEventsAfterToday] = useState([]);

  const handleSwitchChange = (event) => {
    setHidePastDividends(!event.target.checked);
  };

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.graphql(graphqlOperation(listDividends));

      if (isMountedRef.current) {
        const yesterday = new Date().setDate(new Date().getDate() - 1);

        const afterToday = [];
        const parsed = JSON.parse(data.listDividends);

        parsed.forEach(item => {
          if (new Date(item.paymentDate) > yesterday) {
            afterToday.push(item);
          }

        });
        setEventsAfterToday(afterToday);
        // console.log(parsed)
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

  useEffect(() => {
    if (hidePastDividends) {

    } else {

    }
  }, [hidePastDividends]);

  const handleSearchChange = (event) => {
    event.persist();
    setSearch(String(event.target.value).toUpperCase().replace(/[\W_]+/g, ''));
  };

  const handleClearSearch = (event) => {
    event.persist();
    setSearch('');
  };

  const columns = [
    {
      flex: 0.7,
      align: 'right',
      field: 'amount',
      headerName: 'Amount',
      valueGetter: params => formatter.format(params.row.extendedProps.amount),
    },
    {
      flex: 0.7,
      field: 'symbol',
      headerName: 'Symbol',
      renderCell: cell => (
        <Button
          fullWidth
          component={RouterLink}
          to={`/app/chart/${cell.value}`}
          style={{ justifyContent: 'flex-start', textTransform: 'none', padding: 15 }}
        >
          {cell.value}
        </Button>
      )
    },
    {
      flex: 1,
      field: 'paymentDate',
      headerName: 'Pay Date',
      renderCell: cell => format(parseISO(cell.value), 'dd MMM yyyy')
    },
    {
      flex: 1,
      headerName: 'Ex Date',
      field: 'ex_dividend_date',
      hide: mobileDevice && true,
      renderCell: cell => format(parseISO(cell.value), 'dd MMM yyyy')
    },
    {
      flex: 1,
      headerName: 'Record Date',
      field: 'record_date',
      hide: mobileDevice && true,
      renderCell: cell => format(parseISO(cell.value), 'dd MMM yyyy')
    },
  ];

  return (
    <Page className={classes.root} title='Dividends List'>
      <Header
        search={search}
        className={classes.header}
        hidePastDividends={hidePastDividends}
        handleClearSearch={handleClearSearch}
        handleSwitchChange={handleSwitchChange}
        handleSearchChange={handleSearchChange}
      />
      <Card className={classes.card}>
        <DataGrid
          columns={columns}
          autoPageSize={true}
          loading={loading}
          disableSelectionOnClick={true}
          rows={hidePastDividends ? eventsAfterToday : events}
          sortModel={[{ field: 'paymentDate', sort: 'asc' }]}
          filterModel={{ items: [{ columnField: 'symbol', operatorValue: 'contains', value: debouncedSearch }] }}
        />
      </Card>
    </Page>
  );
};

