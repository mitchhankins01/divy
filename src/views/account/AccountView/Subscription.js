import React, {
  useState,
} from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { API } from 'aws-amplify';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {},
  overview: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
      alignItems: 'flex-start'
    }
  },
  productImage: {
    marginRight: theme.spacing(1),
    height: 48,
    width: 48
  },
  details: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }
}));

const Subscription = ({ className, ...rest }) => {
  const classes = useStyles();
  const { attributes } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <Grid item lg={6} xs={12}>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Manage your Subscription" />
        <Divider />
        <CardContent>
          <Box mt={2} display="flex" flexDirection='column'>
            <Box mb={2}>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {`Expires: ${new Date(Number(attributes['custom:expires'])).toISOString().slice(0, 10)}`}
              </Typography>
            </Box>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const fetchSession = async () => {
                  const apiName = 'stripeAPI'
                  const apiEndpoint = '/create-customer-portal-sessio'
                  const body = {
                    id: attributes['custom:stripe_customer_id'],
                  }
                  const session = await API.post(apiName, apiEndpoint, { body });
                  return session;
                };
                const session = await fetchSession();
                window.location.replace(session.url);
              }}
            >
              {loading ? 'Redirecting...' : 'Manage or Cancel Subscription'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Subscription;
