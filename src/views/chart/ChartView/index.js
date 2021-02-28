import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ChartView = (props) => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Chart"
    >
      <Container maxWidth={false}>
        <Box>
          <Chart ticker={props.match.params.ticker} />
        </Box>
      </Container>
    </Page>
  );
};

export default ChartView;
