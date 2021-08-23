import React from 'react';
import clsx from 'clsx';
import { DataGrid } from '@material-ui/data-grid';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import formatter from '../../../utils/numberFormatter';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 654
  },
  dataGrid: {
    border: 0,
    padding: '0 3px'
  }
}));

export default ({ className, data, totalDividends, ...rest }) => {
  const classes = useStyles();
  const columns = [
    { headerName: 'Symbol', field: 'symbol', flex: 0.7 },
    { 
      flex: 0.7, 
      headerName: 'Yield', 
      field: 'dividendYield', 
      renderCell: ({ value }) => Number(value / 100).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 }) },
    {
      flex: 1, 
      headerName: 'Income', 
      field: 'totalDividends', 
      renderCell: ({ value }) => {
        const percentageOfDividends = Number(value / totalDividends).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 1 });
        return `${formatter.format(value)} (${percentageOfDividends})`
      }
    },
  ];

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title='Dividend Income' />
      <Divider />
      <Box style={{ height: 600 }}>
        <DataGrid
          className={classes.dataGrid}
          rows={data}
          columns={columns}
          autoPageSize={true}
          // loading={loading}
          sortModel={[
            {
              field: 'totalDividends',
              sort: 'desc',
            },
          ]}
        />
      </Box>
    </Card>
  );
};
