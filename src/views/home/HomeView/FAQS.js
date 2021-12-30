import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    '& dt': {
      marginTop: theme.spacing(2)
    }
  }
}));

const FAQS = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          color="textPrimary"
        >
          Frequently Asked Questions
        </Typography>
        <Box my={3}>
          <Divider />
        </Box>
        <Grid
          container
          spacing={3}
          component="dl"
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="overline"
              color="secondary"
            >
             Policies
            </Typography>
            <Box mt={6}>
              <dt>
                <Typography
                  variant="h4"
                  color="textPrimary"
                >
                  Where can I find your privacy policy?
                </Typography>
              </dt>
              <dd>
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  <a href="https://www.termsfeed.com/live/79139007-2623-440c-968b-382566ab49a6" rel="noopener noreferrer" target="_blank">You can view our privacy policy by clicking here</a>
                </Typography>
              </dd>
            </Box>
            <Box mt={6}>
              <dt>
                <Typography
                  variant="h4"
                  color="textPrimary"
                >
                  Where can I find your Terms of Service (ToS)?
                </Typography>
              </dt>
              <dd>
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  <a href="/tos" rel="noopener noreferrer" target="_blank">You can view our TOS by clicking here</a>
                </Typography>
              </dd>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="overline"
              color="secondary"
            >
              Other
            </Typography>
            <Box mt={6}>
              <dt>
                <Typography
                  variant="h4"
                  color="textPrimary"
                >
                  What kind of subscriptions do you offer?
                </Typography>
              </dt>
              <dd>
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  You can choose a monthly subscription for $9.99 or a yearly subscription for $99.
                </Typography>
              </dd>
            </Box>
            <Box mt={6}>
              <dt>
                <Typography
                  variant="h4"
                  color="textPrimary"
                >
                  How can I contact you with any questions?
                </Typography>
              </dt>
              <dd>
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Just click the message icon in the bottom left of your screen to start a live chat.
                </Typography>
              </dd>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default FAQS;
