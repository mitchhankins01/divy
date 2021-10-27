import React, { useState } from 'react';
import {
  Edit as EditIcon,
} from 'react-feather';
import {
  Button,
  SvgIcon,
  makeStyles,
  IconButton,
  Card,
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { DataGrid } from '@material-ui/data-grid';
import { useDebounce } from 'use-debounce';
import Header from './Header';
import Page from 'src/components/Page';
import useData from 'src/hooks/useData';
import formatter from 'src/utils/numberFormatter';

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
  const classes = useStyles();
  const history = useHistory();
  const { listStatistics, loading } = useData();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

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
    { headerName: 'Quantity', field: 'quantity', flex: 1 },
    { headerName: 'Buy Price', field: 'price', flex: 1, valueFormatter: params => formatter.format(params.value) },
    { headerName: 'Market Price', field: 'marketPrice', flex: 1, valueFormatter: params => formatter.format(params.value) },
    { headerName: 'Cost Basis', field: 'costBasis', flex: 1, valueFormatter: params => formatter.format(params.value) },
    { headerName: 'Market Value', field: 'marketValue', flex: 1, valueFormatter: params => formatter.format(params.value) },
    { headerName: 'Gain', field: 'gain', flex: 1, valueFormatter: params => formatter.format(params.value) },
    { headerName: 'Created', field: 'createdAt', valueGetter: params => format(new Date(params.row.createdAt), 'dd MMM yyyy H:mm'), flex: 1, hide: true },
    { headerName: 'Updated', field: 'updatedAt', valueGetter: params => format(new Date(params.row.updatedAt), 'dd MMM yyyy H:mm'), flex: 1, hide: true },
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
          rows={listStatistics.data}
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

