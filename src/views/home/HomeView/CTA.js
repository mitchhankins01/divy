import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingTop: 128,
    paddingBottom: 128
  },
  browseButton: {
    marginLeft: theme.spacing(2)
  }
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
          variant="h1"
          align="center"
          color="secondary"
        >
          Sign up for a free account today.
        </Typography>
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
            Sign Up
          </Button>
        </Box>
      </Container>
    </div>
  );
};

