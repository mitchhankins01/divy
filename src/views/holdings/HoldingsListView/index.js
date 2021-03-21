import React from 'react';
import {
  Edit as EditIcon
} from 'react-feather';
import {
  Box,
  Button,
  Container,
  SvgIcon,
  makeStyles,
  IconButton,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import Header from './Header';
import Results from './Results';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditClick = (row) => {
    history.push('/app/holdings/create', row)
  }

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
    { headerName: 'Quantity', field: 'quantity', flex: 1, hide: mobileDevice && true },
    { headerName: 'Price', field: 'price', flex: 1, valueGetter: params => `$${params.row.price}`, hide: mobileDevice && true },
    {
      headerName: 'Edit',
      field: 'edit',
      // flex: 0.4,
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
    <Page
      className={classes.root}
      title="Holdings List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results
            columns={columns}
            apiName='holdingsApi'
            apiPath='/holdings'
            defaultSort='symbol_asc'
            searchText='Symbol'
          />
        </Box>
      </Container>
    </Page>
  );
};

