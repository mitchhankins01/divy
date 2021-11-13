import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(() => ({
  root: {}
}));

export default ({ className, portfolio = {}, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          variant="body1"
          color="inherit"
          to="/app/portfolios"
          component={RouterLink}
        >
          Portfolio
        </Link>
        <Link
          variant="body1"
          color="inherit"
          to="/app/portfolios"
          component={RouterLink}
        >
          List
        </Link>
        <Typography
            variant="body1"
            color="textPrimary"
          >
            {portfolio.id ? 'Edit' : 'Add Portfolio'}
          </Typography>
      </Breadcrumbs>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        {portfolio.id ? `Edit ${portfolio.name}` : 'Add Portfolio'}
      </Typography>
    </div>
  );
};
