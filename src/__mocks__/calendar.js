import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { colors } from '@material-ui/core';
import mock from 'src/utils/mock';

let events = [
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: true,
    color: null,
    description: 'Inform about new contract',
    extendedProps: {
      amount: 500,
    },
    start: moment()
      .subtract(6, 'days')
      .toDate(),
    title: 'AAPL'
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Discuss about new partnership',
    start: moment()
      .add(2, 'days')
      .toDate(),
    title: 'IBM'
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: true,
    color: null,
    extendedProps: {
      amount: 500,
    },
    description: 'Prepare docs',
    start: moment()
      .add(5, 'days')
      .toDate(),
    title: 'MSFT'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'NIKE'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'UMH'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'BAC'
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    extendedProps: {
      amount: 500,
    },
    color: null,
    allDay: true,
    description: 'Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'XRP'
  },
  {
    id: '5e8882f6daf81eccfa40dee2a',
    allDay: true,
    amount: 500,
    color: null,
    description: 'Again Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'VER'
  },
  {
    id: '5e8882f6daf81eccfa40dee23',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: '3 Meet with team to discuss',
    start: moment()
      .subtract(12, 'days')
      .endOf('day')
      .toDate(),
    title: 'O'
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: true,
    color: null,
    extendedProps: {
      amount: 500,
    },
    description: 'Sorry, John!',
    start: moment()
      .add(3, 'days')
      .toDate(),
    title: 'NNN'
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Discuss about the new project',
    start: moment()
      .subtract(6, 'days')
      .toDate(),
    title: 'EPR'
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: true,
    extendedProps: {
      amount: 500,
    },
    color: null,
    description: 'Get a new quote for the payment processor',
    title: 'CXW'
  }
];

mock.onGet('/api/calendar/events').reply(200, { events });

mock.onPost('/api/calendar/events/new').reply((request) => {
  try {
    const { allDay, description, end, start, title } = JSON.parse(request.data);
    const event = {
      id: uuidv4(),
      allDay,
      description,
      end,
      start,
      title
    };

    events = [...events, event];

    return [200, { event }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

mock.onPost('/api/calendar/events/update').reply((request) => {
  try {
    const { eventId, update } = JSON.parse(request.data);
    let event = null;

    events = _.map(events, (_event) => {
      if (_event.id === eventId) {
        _.assign(_event, { ...update });
        event = _event;
      }

      return _event;
    });

    return [200, { event }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

mock.onPost('/api/calendar/events/remove').reply((request) => {
  try {
    const { eventId } = JSON.parse(request.data);

    events = _.reject(events, { id: eventId });

    return [200, { eventId }];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
