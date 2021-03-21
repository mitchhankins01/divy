import React from 'react';
  import {
    Box,
    Container,
    makeStyles
  } from '@material-ui/core';
  import Page from 'src/components/Page';
  import HoldingEditForm from './HoldingEditForm';
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
        title="New Holding"
      >
        <Container maxWidth={false}>
          <Header />
        </Container>
        <Box mt={3}>
          <Container maxWidth="lg">
            <HoldingEditForm />
          </Container>
        </Box>
      </Page>
    );
  };
  