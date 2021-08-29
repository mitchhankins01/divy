import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Edit as EditIcon,
} from 'react-feather';
import {
  Button,
  SvgIcon,
  makeStyles,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { API, Cache, graphqlOperation } from 'aws-amplify';
import { DataGrid } from '@material-ui/data-grid';
import { useDebounce } from 'use-debounce';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { listHoldings } from '../../../graphql/queries';
import Header from './Header';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    }
  },
  header: {
    flex: 1
  },
  card: {
    flex: 10
  },
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const [holdings, setHoldings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const getHoldings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.graphql(graphqlOperation(listHoldings))

      if (isMountedRef.current) {
        setLoading(false);
        setHoldings(data?.listHoldings?.items)
        console.log(data?.listHoldings?.items)
        Cache.setItem('listHoldings', data?.listHoldings?.items)
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    // const cached = Cache.getItem('listHoldings');
    const cached = false;

    if (cached) {
      setHoldings(cached);
    } else {
      getHoldings();
    }
  }, [getHoldings]);

  const handleEditClick = (row) => {
    history.push('/app/holdings/create', row)
  }

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
      flex: 1,
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
    { headerName: 'Quantity', field: 'quantity', flex: 1, hide: mobileDevice && false },
    { headerName: 'Price', field: 'price', flex: 1, valueGetter: params => `$${params.row.price}`, hide: mobileDevice && false },
    { headerName: 'Created', field: 'createdAt', valueGetter: params => format(new Date(params.row.createdAt), 'dd MMM yyyy H:mm'), flex: 1, hide: mobileDevice && true },
    { headerName: 'Updated', field: 'updatedAt', valueGetter: params => format(new Date(params.row.updatedAt), 'dd MMM yyyy H:mm'), flex: 1, hide: mobileDevice && true },
    {
      field: 'edit',
      headerName: ' ',
      width: 70,
      renderCell: params => (
        <IconButton onClick={handleEditClick.bind(null, params.row)}>
          <SvgIcon
            fontSize="small"
            color="action"
          >
            <EditIcon />
          </SvgIcon>
        </IconButton>

      )
    }
  ];

  return (
    <Page className={classes.root} title='Holdings List'>
      <Header
        search={search}
        className={classes.header}
        handleClearSearch={handleClearSearch}
        handleSearchChange={handleSearchChange}
      />
      <Card className={classes.card}>
        <DataGrid
          rows={holdings}
          columns={columns}
          autoPageSize={true}
          loading={loading}
          disableSelectionOnClick={true}
          sortModel={[{ field: 'symbol', sort: 'asc' }]}
          filterModel={{ items: [{ columnField: 'symbol', operatorValue: 'contains', value: debouncedSearch }] }}
        />
      </Card>
    </Page>
  );
};

