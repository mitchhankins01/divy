import React from 'react';
import {
  Edit as EditIcon,
} from 'react-feather';
import {
  SvgIcon,
  makeStyles,
  IconButton,
  Card,
} from '@material-ui/core';
import {  useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { DataGrid } from '@material-ui/data-grid';
import Header from './Header';
import Page from 'src/components/Page';
import useData from 'src/hooks/useData';

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
  const { portfolios, loading } = useData();

  const handleEditClick = (row) => {
    history.push('/app/portfolios/create', row)
  }

  const columns = [
    { headerName: 'Name', field: 'name', flex: 1 },
    { headerName: 'Created', field: 'createdAt', valueGetter: params => params.row.createdAt ? format(new Date(params.row.createdAt), 'dd MMM yyyy H:mm') : '', flex: 1 },
    { headerName: 'Updated', field: 'updatedAt', valueGetter: params => params.row.updatedAt ? format(new Date(params.row.updatedAt), 'dd MMM yyyy H:mm') : '', flex: 1 },
    {
      field: 'edit',
      headerName: ' ',
      width: 70,
      renderCell: params => params.row.id !== 'default' && (
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
    <Page className={classes.root} title='Portfolios List'>
      <Header
        className={classes.header}
      />
      <Card className={classes.card}>
        <DataGrid
          columns={columns}
          autoPageSize={true}
          rows={portfolios}
          disableSelectionOnClick={true}
          loading={loading}
          sortModel={[{ field: 'name', sort: 'asc' }]}
        />
      </Card>
    </Page>
  );
};

