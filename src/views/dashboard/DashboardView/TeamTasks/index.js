import React, {
  useCallback,
  useState,
  useEffect
} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  List,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import GenericMoreButton from 'src/components/GenericMoreButton';
import NewsItem from './NewsItem';

const useStyles = makeStyles(() => ({
  root: {}
}));

const TeamTasks = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [news, setNews] = useState([]);

  const getTasks = useCallback(async () => {
    try {
      const response = await axios.get('/api/reports/latest-tasks');
  
      if (isMountedRef.current) {
        setNews(response.data.news);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Market News"
      />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={400} maxHeight={450}>
          <List>
            {news.map((item, i) => (
              <NewsItem
                divider={i < news.length - 1}
                key={i}
                item={item}
              />
            ))}
          </List>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default TeamTasks;
