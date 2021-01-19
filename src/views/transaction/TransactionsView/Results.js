import React, { useState, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  InputAdornment,
  SvgIcon,
  Tab,
  Tabs,
  TextField,
  makeStyles,
  Chip
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import { DataGrid } from '@material-ui/data-grid';


import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tabs = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'buy',
    label: 'Buy'
  },
  {
    value: 'sell',
    label: 'Sell'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  },
  buyChip: {
    background: '#27ae60',
    color: 'white'
  },
  sellChip: {
    background: '#c0392b',
    color: 'white'
  }
}));

const Results = ({
  className,
  customers,
  ...rest
}) => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('all');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Tabs
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="secondary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>
      <Divider />
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
            )
          }}
          onChange={handleQueryChange}
          placeholder="Search Transactions"
          value={query}
          variant="outlined"
        />
        <Box flexGrow={1} />
      </Box>
      <PerfectScrollbar>
        <Box minWidth={700} style={{ minHeight: '70vh' }}>
          <DataGrid
            rows={customers}
            columns={[
              { headerName: 'Symbol', field: 'symbol', flex: 1 },
              { headerName: 'Shares', field: 'numberOfShares', flex: 1 },
              { headerName: 'Price', field: 'price', flex: 1, valueGetter: params => `$${params.row.price}` },
              { headerName: 'Fees', field: 'fees', flex: 1 },
              { 
                headerName: 'Side', 
                field: 'side', 
                flex: 1,
                renderCell: params => (
                  <Chip 
                  size='small' 
                    label={params.row.side === 'BUY' ? 'Buy' : 'Sell'} 
                    className={params.row.side === 'BUY' ? classes.buyChip : classes.sellChip}
                  />
              )
              },
              { headerName: 'Date', field: 'date', flex: 1 },
            ]}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            scrollbarSize={0}
            pagination={true}
            checkboxSelection
          />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

Results.defaultProps = {
  customers: []
};

export default Results;
