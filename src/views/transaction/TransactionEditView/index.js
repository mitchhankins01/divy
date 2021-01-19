import React, {
    useState,
    useCallback,
    useEffect
  } from 'react';
  import {
    Box,
    Container,
    makeStyles
  } from '@material-ui/core';
  import axios from 'src/utils/axios';
  import Page from 'src/components/Page';
  import useIsMountedRef from 'src/hooks/useIsMountedRef';
  import TransactionEditForm from './TransactionEditForm';
  import Header from './Header';
  
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    }
  }));
  
export default () => {
    const classes = useStyles();
  
    return (
      <Page
        className={classes.root}
        title="New Transaction"
      >
        <Container maxWidth={false}>
          <Header />
        </Container>
        <Box mt={3}>
          <Container maxWidth="lg">
            <TransactionEditForm />
          </Container>
        </Box>
      </Page>
    );
  };
  