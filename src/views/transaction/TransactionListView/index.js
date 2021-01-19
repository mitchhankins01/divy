import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const TransactionsView = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [transactions, setTransactions] = useState([]);

  const getTransactions = useCallback(async () => {
    try {
      const response = await axios.get('/api/transactions');

      if (isMountedRef.current) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);
  
  return (
    <Page
      className={classes.root}
      title="Transactions List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results transactions={transactions} />
        </Box>
      </Container>
    </Page>
  );
};

export default TransactionsView;
