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
  label: {
    marginLeft: theme.spacing(1)
  },
  dataGrid: {
    border: 0,
    padding: '0 3px'
  }
}));

export default ({ className, data, marketValue, ...rest }) => {
  const classes = useStyles();
  const columns = [
    { headerName: 'Symbol', field: 'symbol', flex: 0.7 },
    // { headerName: 'Cost Basis', field: 'costBasis', flex: 1, renderCell: cell => formatter.format(cell.value), hide: isMobileDevice },
    {
      headerName: 'Market Value',
      field: 'marketValue',
      flex: 1,
      renderCell: ({ value }) => {
        const percentageOfPortfolio = Number(value / marketValue).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 1 });
        return `${formatter.format(value)} (${percentageOfPortfolio})`
      }
    },
    // {
    //   headerName: 'Gain', hide: isMobileDevice, field: 'gain', flex: 1, renderCell: ({ value, row }) => {
    //     const gainPercentage = Number(value / row.costBasis).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 });
    //     return (
    //       <span>
    //         {formatter.format(value)}
    //         <Label className={classes.label} color={value > 0 ? 'success' : 'error'} >
    //           {value > 0 ? '+' : ''}
    //           {gainPercentage}
    //         </Label>
    //       </span>
    //     )
    //   }
    // },
  ];

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title='Market Value' />
      <Divider />
      <Box style={{ height: 600 }}>
        <DataGrid
          className={classes.dataGrid}
          rows={data}
          columns={columns}
          autoPageSize={true}
          // loading={loading}
          disableSelectionOnClick={true}
          sortModel={[
            {
              field: 'marketValue',
              sort: 'desc',
            },
          ]}
        />
      </Box>
    </Card>
  );
};
