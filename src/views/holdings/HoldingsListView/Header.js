import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  PlusCircle as PlusCircleIcon,
  Search as SearchIcon,
  XCircle as ClearIcon
} from 'react-feather';
import { CloudUpload } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    height: 56,
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0
    },
  },
  queryField: {
    width: 250,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
}));

export default ({
  search = '',
  className,
  handleClearSearch,
  handleSearchChange,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
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
            to="/app/holdings"
            component={RouterLink}
          >
            Holdings
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            List
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Holding List
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          className={classes.queryField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  fontSize="small"
                  color="action"
                >
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} disabled={!search.length} >
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <ClearIcon />
                  </SvgIcon>
                </IconButton>
              </InputAdornment>
            )
          }}
          onChange={handleSearchChange}
          autoComplete='off'
          autoCorrect='off'
          placeholder='Symbol'
          value={search}
          variant='outlined'
        />
        <Button
          className={classes.button}
          color='secondary'
          variant='outlined'
          component={RouterLink}
          to='/app/holdings/import'
          startIcon={
            <SvgIcon fontSize='small'>
              <CloudUpload />
            </SvgIcon>
          }
        >
          Import Holdings
        </Button>
        <Button
          className={classes.button}
          color='secondary'
          variant='contained'
          component={RouterLink}
          to='/app/holdings/create'
          startIcon={
            <SvgIcon fontSize='small'>
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

