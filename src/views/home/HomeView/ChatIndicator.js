import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingTop: 128,
    // paddingBottom: 128
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
          Questions?
        </Typography>
        <Typography
          variant="h1"
          align="center"
          color="secondary"
        >
          Start a chat!
        </Typography>
        <Box
          mt={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <span style={{ fontSize: '10em' }}>&#10550;</span>
        </Box>
      </Container>
    </div>
  );
};

