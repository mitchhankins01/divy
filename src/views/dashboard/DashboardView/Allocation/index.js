import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
  root: {},
  chart: {
    height: 385
  },
}));

const EarningsSegmentation = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [earnings, setEarnings] = useState(null);

  const getEarnings = useCallback(async () => {
    try {
      const response = await axios.get('/api/reports/earnings');

      if (isMountedRef.current) {
        setEarnings(response.data.earnings);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEarnings();
  }, [getEarnings]);

  if (!earnings) {
    return null;
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title='Allocation'
      />
      <Divider />
      <PerfectScrollbar>
        <Box
          p={3}
          // minHeight={320}
        >
          <Chart data={earnings} className={classes.chart} />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

EarningsSegmentation.propTypes = {
  className: PropTypes.string
};

export default EarningsSegmentation;
