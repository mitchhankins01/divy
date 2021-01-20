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
import { buyColor, sellColor } from '../../../theme';

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
    background: buyColor,
    color: 'white'
  },
  sellChip: {
    background: sellColor,
    color: 'white'
  }
}));

const Results = ({
  className,
  transactions,
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
            rows={transactions}
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
  transactions: PropTypes.array.isRequired
};

Results.defaultProps = {
  transactions: []
};

export default Results;
