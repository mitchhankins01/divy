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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { DataGrid } from '@material-ui/data-grid';
import { useDebounce } from 'use-debounce';
import Header from './Header';
import Page from 'src/components/Page';
import useData from 'src/hooks/useData';
import formatter from 'src/utils/numberFormatter';
import { deleteHolding } from 'src/graphql/mutations';

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
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [debouncedSearch] = useDebounce(search, 500);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const { listStatistics, loading, processRefetch } = useData();
  const [selectedHoldings, setSelectedHoldings] = React.useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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

  const onClickDeleteSelectedHoldings = async () => {
    setDeleteDialogOpen(true);
  }

  const onClickCancelDeleteDialog = () => {
    setDeleteDialogOpen(false);
  }

  const onClickConfirmDeleteDialog = async () => {
    setDeleteDialogOpen(false);
    setDeleteLoading(true);

    for (const id of selectedHoldings) {
      await API.graphql(graphqlOperation(deleteHolding, { input: { id } }));
    }

    processRefetch();
    setDeleteLoading(false);
    setSelectedHoldings([]);
    enqueueSnackbar('Holdings Deleted', { variant: 'success' });
  }

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
        loading={loading || deleteLoading}
        selectedHoldings={selectedHoldings}
        handleClearSearch={handleClearSearch}
        handleSearchChange={handleSearchChange}
        onClickDeleteSelectedHoldings={onClickDeleteSelectedHoldings}
      />
      <Card className={classes.card}>
        <DataGrid
          columns={columns}
          autoPageSize={true}
          checkboxSelection={true}
          rows={listStatistics.data}
          disableSelectionOnClick={true}
          loading={loading || deleteLoading}
          sortModel={[{ field: 'symbol', sort: 'asc' }]}
          onSelectionChange={({ rowIds }) => setSelectedHoldings(rowIds)}
          filterModel={{ items: [{ columnField: 'symbol', operatorValue: 'contains', value: debouncedSearch }] }}
        />
        <Dialog open={deleteDialogOpen} onClose={onClickCancelDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the selected holdings? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClickCancelDeleteDialog} color="primary" autoFocus>
              No, Cancel
            </Button>
            <Button onClick={onClickConfirmDeleteDialog} color="primary" style={{ color: 'red' }}>
              Yes, I'm sure
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Page>
  );
};

