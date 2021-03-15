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

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  }
}));


const Table = ({
  className,
  columns,
  apiName,
  apiPath,
  defaultSort,
  searchText,
  ...rest
}) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [sort, setSort] = useState(defaultSort);

  const getData = useCallback(async (limit, offset, sort, search) => {
    try {
      setLoading(true);
      const response = await API.get(apiName, apiPath, {
        queryStringParameters: {
          sort,
          limit,
          offset,
          search
        }
      });

      if (isMountedRef.current) {
        setLoading(false);
        setRowCount(response.count || rowCount);
        setData(response.result);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMountedRef]);

  useEffect(() => {
    const limit = pageSize;
    const offset = (pageIndex - 1) * pageSize;

    getData(limit, offset, sort, search);
  }, [getData, pageIndex, pageSize, sort, search]);

  const handleSearchChange = (event) => {
    event.persist();
    setSearch(event.target.value);
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
                <IconButton onClick={handleClearSearch} >
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
          placeholder={searchText}
          value={search}
          variant="outlined"
        />
        <Box flexGrow={1} />
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700} style={{ minHeight: '70vh' }}>
          <DataGrid
            rows={data}
            page={pageIndex}
            pagination={true}
            scrollbarSize={0}
            pageSize={pageSize}
            rowCount={rowCount}
            paginationMode='server'
            columns={columns}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onPageChange={args => setPageIndex(args.page)}
            onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
            sortModel={[{ field: sort.split('_')[0], sort: sort.split('_')[1] }]}
            onSortModelChange={args => {
              setPageIndex(1);
              if (args.sortModel[0] && args.sortModel[0].field && args.sortModel[0].sort) {
                setSort(`${[args.sortModel[0].field]}_${args.sortModel[0].sort}`)
              } else {
                setSort(defaultSort);
              }
            }}
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default Table;
