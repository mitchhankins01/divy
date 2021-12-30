import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
  // Grid,
  // Paper,
  // Divider
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingTop: 128,
    paddingBottom: 128
  },
  browseButton: {
    marginLeft: theme.spacing(2)
  },
  product: {
    position: 'relative',
    padding: theme.spacing(5, 3),
    backgroundColor: theme.palette.background.dark,
  },
  recommendedProduct: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
}));

export default ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          align="center"
          color="textPrimary"
        >
          Ready to get started?
        </Typography>
        <Typography
          variant="h2"
          align="center"
          color="secondary"
        >
          Sign up for a free two week trial today,
        </Typography>
        <Typography
          variant="h2"
          align="center"
          color="secondary"
        >
          you can cancel at any time.
        </Typography>

        {/* <Box mt={5}>
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
                </Paper>
              </Grid>
            </Grid>

          </Container>
        </Box> */}

        <Box
          mt={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            color="secondary"
            component="a"
            href="/register"
            variant="contained"
          >
             Sign up for a trial
          </Button>
        </Box>
      </Container>
    </div>
  );
};

