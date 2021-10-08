import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { API, Auth } from 'aws-amplify';
import { loadStripe } from '@stripe/stripe-js';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    // paddingTop: 120,
    // paddingBottom: 120
  },
  product: {
    position: 'relative',
    padding: theme.spacing(5, 3),
    cursor: 'pointer',
    // transition: theme.transitions.create('transform', {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen
    // }),
    // '&:hover': {
    //   transform: 'scale(1.1)'
    // }
  },
  productImage: {
    borderRadius: theme.shape.borderRadius,
    position: 'absolute',
    top: -24,
    left: theme.spacing(3),
    height: 48,
    width: 48,
    fontSize: 24
  },
  recommendedProduct: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  chooseButton: {
    backgroundColor: theme.palette.common.white
  }
}));

const stripePromise = loadStripe('pk_test_51JWjXZFRojIX8Uh4WO9RpSwXYM6IrS4PjNdfdDErr4yEICGPaZHASB9XXr7mdTrY8puy030kYKBcVG0oZJKXG9YO00vDrU6jW5');

export default () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const fetchSession = async (priceId) => {
    setLoading(true);
    const { username } = await Auth.currentAuthenticatedUser();
    const apiName = 'stripeAPI'
    const apiEndpoint = '/checkout'
    const body = {
      quantity: 1,
      client_reference_id: username,
      priceId
    }
    const session = await API.post(apiName, apiEndpoint, { body });
    return session;
  };

  return (
    <Page
      className={classes.root}
      title="Pricing"
    >
      <Container maxWidth="sm">
        <Box pt={3}>
          <Typography
            align="center"
            variant="h2"
            color="textPrimary"
          >
            Two Weeks Free Trial
          </Typography>
          <Typography
            align="center"
            variant="subtitle1"
            color="textSecondary"
            style={{ marginTop: 20 }}
          >
            Discover the power of Divy with a no-commitment free trial.
            Simply choose from one of the options below. You can cancel at any time.
          </Typography>
        </Box>
      </Container>
      <Box mt={5}>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <Paper
                className={classes.product}
                elevation={1}
              >
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  Monthly
                </Typography>
                <div>
                  <Typography
                    component="span"
                    display="inline"
                    variant="h3"
                    color="textPrimary"
                  >
                    $12.99
                  </Typography>
                  <Typography
                    component="span"
                    display="inline"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    /month
                  </Typography>
                </div>
                <Typography
                  variant="overline"
                  color="textSecondary"
                >
                  Renews Monthly
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="textPrimary"
                >
                  Unlimited Holdings
                  <br />
                  Automatic Dividend Tracking
                  <br />
                  Chat Support
                  <br />
                  Automatically Rewews Monthly
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className={classes.chooseButton}
                  onClick={async () => {
                    try {
                      const session = await fetchSession('price_1JWjYyFRojIX8Uh4Q3W5QFi0');
                      const stripe = await stripePromise;
                      stripe.redirectToCheckout({ sessionId: session.id });
                    } catch (error) {
                      console.log('error', error)
                    }
                  }}
                >
                  {loading ? 'Redirecting to Checkout' : 'Choose Monthly'}
                </Button>
              </Paper>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Paper
                className={clsx(classes.product, classes.recommendedProduct)}
                elevation={1}
              >
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="inherit"
                >
                  Yearly
                </Typography>
                <div>
                  <Typography
                    component="span"
                    display="inline"
                    variant="h3"
                    color="inherit"
                  >
                    $99
                  </Typography>
                  <Typography
                    component="span"
                    display="inline"
                    variant="subtitle2"
                    color="inherit"
                  >
                    /year
                  </Typography>
                </div>
                <Typography
                  variant="overline"
                  color="inherit"
                >
                  Renews Yearly
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="inherit"
                >
                  Unlimited Holdings
                  <br />
                  Automatic Dividend Tracking
                  <br />
                  Priority Chat Support
                  <br />
                  Automatically Rewews Monthly
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className={classes.chooseButton}
                  onClick={async () => {
                    try {
                      const session = await fetchSession('price_1JWjZWFRojIX8Uh4yNsQ4cOp');
                      const stripe = await stripePromise;
                      stripe.redirectToCheckout({ sessionId: session.id });
                    } catch (error) {
                      console.log('error', error)
                    }
                  }}
                >
                  {loading ? 'Redirecting to Checkout' : 'Choose Yearly'}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};
