import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import {
  Paper,
  useTheme,
  useMediaQuery,
  makeStyles,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useWindowSize from '../../../hooks/useWindowSize';
// import LoadingScreen from 'src/components/LoadingScreen';
import formatter from '../../../utils/numberFormatter';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
  },
  header: {
    flex: 1
  },
  calendar: {
    flex: 10,
    // marginTop: theme.spacing(3),
    // padding: theme.spacing(2),
    '& .fc-unthemed .fc-head': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-body': {
      backgroundColor: theme.palette.background.default
    },
    '& .fc-unthemed .fc-row': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc-unthemed .fc-divider': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed th': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed td.fc-today': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-highlight': {
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed a.fc-more': {
      ...theme.typography.body2,
      margin: 5,
      padding: '0 5px',
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      // width: '100%',
      display: 'block',
      borderRadius: 3,
      textDecoration: 'none'
    },
    '& .fc-unthemed .fc-event-dot': {
      backgroundColor: theme.palette.secondary.main
    },
    '& .fc-unthemed .fc-popover': {
      border: `1px solid ${theme.palette.background.dark}`,
    },
    '& .fc-unthemed .fc-popover .fc-header': {
      ...theme.typography.body2,
      background: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-event': {
      // backgroundColor: theme.palette.background.default,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      // borderWidth: 0,
      // border: `1px solid ${theme.palette.secondary.main}`,
      border: 'none',
      // color: theme.palette.secondary.main,
      padding: '0 5px',
      margin: 5,
      // opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body2,
        color: 'inherit'
      },
      '&:hover': {
        cursor: 'pointer',
      }
    },
    '& .fc-unthemed .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc-unthemed .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-list-view': {
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-list-empty': {
      ...theme.typography.subtitle1,
      background: theme.palette.background.dark
    },
    '& .fc-unthemed .fc-list-heading td': {
      backgroundColor: theme.palette.background.dark,
      borderColor: theme.palette.divider
    },
    '& .fc-unthemed .fc-list-heading-main': {
      ...theme.typography.h6
    },
    '& .fc-unthemed .fc-list-heading-alt': {
      ...theme.typography.h6
    },
    '& .fc-unthemed .fc-list-item:hover td': {
      backgroundColor: theme.palette.background.dark,
    },
    '& .fc-unthemed .fc-list-item-title': {
      ...theme.typography.body1
    },
    '& .fc-unthemed .fc-list-item-time': {
      ...theme.typography.body2
    },
  }
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();
  const calendarRef = useRef(null);
  const { listDividends: { all }} = useAuth();
  const [date, setDate] = useState(new Date());
  const { height: windowHeight } = useWindowSize();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
  const emptyDialog = {
    symbol: undefined,
    amount: undefined,
    name: undefined,
    dividend_yield: undefined,
    ex_dividend_date: undefined,
    frequency: undefined,
    paymentDate: undefined,
    record_date: undefined,
  };
  const [dialog, setDialog] = useState(emptyDialog);

  const toggleDialog = (event = undefined) => {
    if (!event) {
      setDialog(emptyDialog);
    } else {
      setDialog({
        symbol: event.symbol,
        name: event.name,
        amount: event.amount,
        frequency: event.frequency,
        paymentDate: event.paymentDate,
        record_date: event.record_date,
        dividend_yield: event.dividend_yield,
        ex_dividend_date: event.ex_dividend_date,
      });
    }
  }

  const handleEventSelect = (arg) => {
    toggleDialog(arg.event.extendedProps);
  };

  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  useEffect(() => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [mobileDevice]);

  return (
    <>
      <Page className={classes.root} title='Calendar'>
        <Header
          date={date}
          view={view}
          className={classes.header}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
        />
        <Paper className={classes.calendar}>
          {/* {loading && <LoadingScreen />} */}
          <FullCalendar
            weekends
            eventLimit
            header={false}
            events={all}
            ref={calendarRef}
            defaultDate={date}
            defaultView={view}
            rerenderDelay={10}
            allDayMaintainDuration
            eventClick={handleEventSelect}
            height={Number(windowHeight) - 185}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin
            ]}
          />
        </Paper>
      </Page>
      <Dialog fullWidth={true} onClose={() => toggleDialog(undefined)} open={Boolean(dialog.symbol)}>
        <DialogTitle>Dividend Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <DialogContentText>
            Symbol: {dialog.symbol}
          </DialogContentText>
          <DialogContentText>
            Name: {dialog.name}
          </DialogContentText>
          <DialogContentText>
            Frequency: {dialog.frequency}
          </DialogContentText>
          <DialogContentText>
            Amount: {formatter.format(dialog.amount)}
          </DialogContentText>
          <DialogContentText>
            Dividend Yield: {Number(dialog.dividend_yield).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 })}
          </DialogContentText>
          <DialogContentText>
            Payment Date: {dialog.paymentDate}
          </DialogContentText>
          <DialogContentText>
            Record Date: {dialog.record_date}
          </DialogContentText>
          <DialogContentText>
            Ex Dividend Date: {dialog.ex_dividend_date}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(undefined)} color='primary' autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};