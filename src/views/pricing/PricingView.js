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
  makeStyles,
  Link,
  CircularProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import { API, Auth } from 'aws-amplify';
import { loadStripe } from '@stripe/stripe-js';
import useAuth from 'src/hooks/useAuth';
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
  },
  product: {
    position: 'relative',
    padding: theme.spacing(5, 3),
    cursor: 'pointer',
  },
  recommendedProduct: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  chooseButton: {
    backgroundColor: theme.palette.common.white
  },
  spinnerRoot: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 999999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    userSelect: 'none'
  },
  spinner: {
    marginBottom: 30
  }
}));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { attributes, updateUserAttributes, logout } = useAuth();

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

  // redirect form stripe checkout
  if (location.search.includes('session_id')) {
    React.useEffect(() => {
      if (attributes['custom:subscription']) {
        history.push('/app/dashboard');
      }
    }, [attributes, history]);

    React.useEffect(() => {
      const interval = setInterval(() => {
        updateUserAttributes();
      }, 3000);
      return () => clearInterval(interval);
    }, [updateUserAttributes]);

    return (
      <div className={classes.spinnerRoot}>
        <CircularProgress size={100} className={classes.spinner} />
        <Typography
          align="center"
          variant="h3"
          color="textSecondary"
        >
          Divy is setting up your account...
        </Typography>
      </div>
    );
  }

  // const hasSubscription = false;
  const hasSubscription = attributes['custom:subscription'];
  return (
    <Page
      className={classes.root}
      title="Pricing"
    >
      {hasSubscription ? (
        <Box pt={3}>
          <Typography
            align="center"
            variant="body1"
            color="textPrimary"
          >
            You are already a subscriber!
            {' '}
            <Link
              component={RouterLink}
              to="/app/account"
              variant="h5"
              color="textPrimary"
              underline="none"
            >
              You can manage your subscription under account settings.
            </Link>
          </Typography>
          <Box pt={2}>
            <Button onClick={logout}>
              Experiencing issues? Click here to logout.
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Container maxWidth="sm">
            <Box pt={3}>
              <Typography
                align="center"
                variant="h2"
                color="textPrimary"
              >
                Free Two Week Trial
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
                          const session = await fetchSession(process.env.REACT_APP_PRICE_ID_MONTHLY);
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
                      Yearly (35% Off!)
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
                      Automatically Rewews Yearly
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
                          const session = await fetchSession(process.env.REACT_APP_PRICE_ID_YEARLY);
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

              <Box pt={2}>
                <Button onClick={logout}>
                  Experiencing issues? Click here to logout.
                </Button>
              </Box>
            </Container>
          </Box>
        </>
      )}
    </Page>
  );
};
