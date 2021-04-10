import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Search as SearchIcon,
  XCircle as ClearIcon
} from 'react-feather';
import {
  Box,
  Card,
  InputAdornment,
  SvgIcon,
  TextField,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import { API } from 'aws-amplify';
import { DataGrid } from '@material-ui/data-grid';
import PerfectScrollbar from 'react-perfect-scrollbar';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { listHoldings } from '../../../graphql/queries';

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  }
}));


const Table = ({
  className,
  columns,
  ...rest
}) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  // const [rowCount, setRowCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async (search) => {
    try {
      setLoading(true);
      const response = await API.graphql({
        query: listHoldings, variables: { filter: { symbol: { contains: search.toUpperCase() } } }
      });

      if (isMountedRef.current) {
        setLoading(false);
        setData(response.data?.listHoldings?.items || [])
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMountedRef]);

  useEffect(() => {
    getData(search);
  }, [getData, search]);

  const handleSearchChange = (event) => {
    event.persist();
    setSearch(String(event.target.value).toUpperCase());
  };

  const handleClearSearch = (event) => {
    event.persist();
    setSearch('');
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        p={2}
        minHeight={56}
        display="flex"
        alignItems="center"
      >
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
          placeholder='Search Holdings'
          value={search}
          variant="outlined"
        />
        <Box flexGrow={1} />
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700} style={{ minHeight: '70vh' }}>
          <DataGrid
            rows={data}
            pagination={true}
            scrollbarSize={0}
            columns={columns}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20, 50]}
            sortModel={[
              {
                field: 'symbol',
                sort: 'asc',
              },
            ]}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default Table;
