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
  InputAdornment,
  SvgIcon,
  TextField,
  IconButton,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  XCircle as ClearIcon
} from 'react-feather';
// import { format as formatDate, parse } from 'date-fns';
import { DataGrid } from '@material-ui/data-grid';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API, graphqlOperation } from 'aws-amplify';
import Page from 'src/components/Page';
import Header from './Header';
import { listDividends } from '../../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  queryField: {
    width: 500
  }
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
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [search, setSearch] = useState('');

  const getEvents = useCallback(async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listDividends));

      if (isMountedRef.current) {
        const parsed = JSON.parse(data.listDividends);
        console.log(parsed);
        setEvents(parsed);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const handleSearchChange = (event) => {
    event.persist();
    setSearch(String(event.target.value).toUpperCase());
  };

  const handleClearSearch = (event) => {
    event.persist();
    setSearch('');
  };

// amount: 0.18
// declaredDate: "2021-04-01"
// exDate: "2021-05-14"
// extendedProps: {amount: 1.7999999999999998}
// frequency: "quarterly"
// paymentDate: "2021-06-15"
// quantity: 10
// recordDate: "2021-05-17"
// symbol: "MNR"

  const columns = [
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
    { headerName: 'Amount', field: 'amount', flex: 1, valueGetter: params => `$${formatNumber(params.row.extendedProps.amount)}`, hide: mobileDevice && true },
    // { headerName: 'Amount', field: 'amount', flex: 1, valueGetter: params => `$${params.row.extendedProps.amount}`, hide: mobileDevice && true },
    { headerName: 'Pay Date', field: 'paymentDate', flex: 1, valueGetter: params => params.row.paymentDate, hide: mobileDevice && true },
    { headerName: 'Ex Date', field: 'exDate', flex: 1, valueGetter: params => params.row.exDate, hide: mobileDevice && true },
    { headerName: 'Declared Date', field: 'declared', flex: 1, valueGetter: params => params.row.declaredDate, hide: mobileDevice && true },
    { headerName: 'Record Date', field: 'recordDate', flex: 1, valueGetter: params => params.row.recordDate, hide: mobileDevice && true },
  ];

  return (
    <Page
      className={classes.root}
      title='Dividends List'
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Card>
            <Box
              p={2}
              minHeight={56}
              display="flex"
              alignItems="center"
            >
              <TextField
                className={classes.queryField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} disabled={!search.length} >
                        <SvgIcon
                          fontSize="small"
                          color="action"
                        >
                          <ClearIcon />
                        </SvgIcon>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={handleSearchChange}
                placeholder='Search Holdings'
                value={search}
                variant="outlined"
              />
              <Box flexGrow={1} />
            </Box>
            <PerfectScrollbar>
              <Box minWidth={700} style={{ minHeight: '70vh' }}>
                <DataGrid
                  rows={events}
                  pagination={true}
                  scrollbarSize={0}
                  columns={columns}
                  // loading={loading}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              </Box>
            </PerfectScrollbar>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

