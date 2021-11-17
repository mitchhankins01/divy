import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useData from 'src/hooks/useData';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { getSelectedPortfoliosLength } = useData();
  const selectedPortfoliosLength = getSelectedPortfoliosLength();

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Main
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Dashboard
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        {selectedPortfoliosLength !== 0 && selectedPortfoliosLength !== 'All' && (
          <Typography
            variant="body1"
            color="error"
          >
            Only showing data from selected portfolios.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Header;
