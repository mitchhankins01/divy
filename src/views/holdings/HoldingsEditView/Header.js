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

export default ({ className, holding, ...rest }) => {
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
          to="/app/holdings"
          component={RouterLink}
        >
          Holdings
        </Link>
        <Link
          variant="body1"
          color="inherit"
          to="/app/holdings"
          component={RouterLink}
        >
          List
        </Link>
        <Typography
            variant="body1"
            color="textPrimary"
          >
            {holding.id ? 'Edit' : 'Add Holding'}
          </Typography>
      </Breadcrumbs>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        {holding.id ? `Edit ${holding.symbol}` : 'Add Holding'}
      </Typography>
    </div>
  );
};
