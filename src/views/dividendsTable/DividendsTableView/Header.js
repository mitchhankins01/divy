import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import {
  Search as SearchIcon,
  XCircle as ClearIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 300,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      width: '100%'
    },
  },
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

export default ({
  className,
  handleClearSearch,
  handleSearchChange,
  search,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={0}
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
            to="/app/dividendslist"
            component={RouterLink}
          >
            Dividends
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
          Dividends List
        </Typography>
      </Grid>
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
        placeholder='Symbol'
        value={search}
        variant='outlined'
      />
    </Grid>
  );
}
