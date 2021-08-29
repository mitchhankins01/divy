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
  makeStyles,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import {
  Search as SearchIcon,
  XCircle as ClearIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  switch: {
    height: 56,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  queryField: {
    width: 250,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: 170,
    },
  },
}));

export default ({
  search,
  className,
  handleClearSearch,
  handleSearchChange,
  hidePastDividends,
  handleSwitchChange,
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
          Dividend List
        </Typography>
      </Grid>
      <Grid item>
        <FormControlLabel
          labelPlacement='start'
          label='Show Past Dividends'
          className={classes.switch}
          control={
            <Switch
              color='primary'
              checked={!hidePastDividends}
              onChange={handleSwitchChange}
            />
          }
        />
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
      </Grid>

    </Grid>
  );
}
