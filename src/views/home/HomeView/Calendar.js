import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Container,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: 200,
    paddingBottom: 200,
    minHeight: 'calc(100vh - 64px)',
    [theme.breakpoints.down('md')]: {
      paddingTop: 60,
      paddingBottom: 60
    }
  },
  technologyIcon: {
    height: 40,
    margin: theme.spacing(1)
  },
  image: {
    perspectiveOrigin: 'left center',
    transformStyle: 'preserve-3d',
    // perspective: 2000,
    '& > img': {
      maxWidth: '100%',
      height: 'auto',
      backfaceVisibility: 'hidden',
      // transform: 'rotateY(5deg) rotateX(5deg)',
      boxShadow: theme.shadows[16]
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 60,
    }
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
        <Grid container spacing={3}>
        <Grid
            item
            xs={12}
            md={8}
          >
            <Box position="relative">
              <div className={classes.image}>
                <img
                  alt="Presentation"
                  src="/static/home/calendar.png"
                />
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
            >
              <Typography
                variant="overline"
                color="secondary"
              >
                Income at a Glance
              </Typography>
              <Typography
                variant="h1"
                color="textPrimary"
              >
                Dividend Calendar
              </Typography>
              <Box mt={3}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Easily see when, and how much you're getting paid.
                </Typography>
              </Box>
            </Box>
          </Grid>

         
        </Grid>
      </Container>
    </div>
  );
};
