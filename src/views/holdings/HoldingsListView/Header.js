import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'react-feather';

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
            Holdings
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          All Holdings
        </Typography>
        <Box mt={2}>
          <Button startIcon={
            <SvgIcon fontSize="small">
              <UploadIcon />
            </SvgIcon>
          }>
            Import
          </Button>
          <Button startIcon={
            <SvgIcon fontSize="small">
              <DownloadIcon />
            </SvgIcon>
          }>
            Export
          </Button>
        </Box>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to="/app/holdings/create"
          startIcon={
            <SvgIcon fontSize="small">
              <PlusCircleIcon />
            </SvgIcon>
          }
        >
          Add Holding
        </Button>
      </Grid>
    </Grid>
  );
};

export default Header;
