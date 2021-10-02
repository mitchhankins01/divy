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
import { format } from 'date-fns';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Toolbar from './Toolbar';
import formatter from 'src/utils/numberFormatter';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}));

const Header = ({
  className,
  onAddClick,
  date,
  onDateNext,
  onDatePrev,
  onDateToday,
  onViewChange,
  view,
  totalMonthlyDividends,
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
            to="/app/dividends/list"
            component={RouterLink}
          >
            Dividends
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Calendar
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {format(date, 'MMMM yyyy')}
        </Typography>
      </Grid>
      <Grid item >
        <Typography
          variant="subtitle2"
          color="inherit"
        >
          {`${format(date, 'MMMM')} Total:`}
        </Typography>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {formatter.format(totalMonthlyDividends)}
        </Typography>
      </Grid>
      <Grid item>
        <Toolbar
          date={date}
          onDateNext={onDateNext}
          onDatePrev={onDatePrev}
          onDateToday={onDateToday}
          onViewChange={onViewChange}
          view={view}
        />
      </Grid>
    </Grid>
  );
}

export default Header;
