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
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import Header from './Header';
import Results from './Results';
import Page from 'src/components/Page';
import { buyColor, sellColor } from '../../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  buyChip: {
    background: buyColor,
    color: 'white'
  },
  sellChip: {
    background: sellColor,
    color: 'white'
  }
}));

const TransactionsView = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditClick = (row) => {
    history.push('/app/transactions/create', row)
  }

  const columns = [
    {
      headerName: 'Side',
      field: 'side',
      // flex: 1,
      renderCell: params => (
        <Chip
          size='small'
          label={params.row.side === 'BUY' ? 'Buy' : 'Sell'}
          className={params.row.side === 'BUY' ? classes.buyChip : classes.sellChip}
        />
      )
    },
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
      headerName: 'Date',
      field: 'date',
      hide: mobileDevice && true,
      flex: 1,
      valueGetter: params => {
        try {
          return new Date(params.row.date).toISOString().substring(0, 10);
        } catch (error) {
          return params.row.date;
        }
      }
    },
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
      title="Transactions List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results
            columns={columns}
            apiName='transactionsApi'
            apiPath='/transactions'
            defaultSort='date_desc'
            searchText='Symbol'
          />
        </Box>
      </Container>
    </Page>
  );
};

export default TransactionsView;
