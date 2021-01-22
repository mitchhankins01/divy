import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  Button,
  Box,
  Checkbox,
  makeStyles
} from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
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
            Transactions
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={true}
                onChange={() => {}}
                name="checkedB"
                color="primary"
              />
            }
            label="Primary"
          />

        </FormGroup>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
