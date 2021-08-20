import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    makeStyles,
    IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth, Cache } from 'aws-amplify';

import { createHolding, updateHolding, deleteHolding } from '../../../graphql/mutations';

const useStyles = makeStyles(() => ({
    buttonsBar: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

export default ({
    className,
    ...rest
}) => {
    const history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    let holding;
    if (history.location.state) {
        holding = { ...history.location.state };
    } else {
        holding = {};
    }

    const handleDeleteClick = async () => {
        Cache.clear();
        await API.graphql(graphqlOperation(deleteHolding, { input: { id: holding.id } }));
        enqueueSnackbar('Holding Deleted', { variant: 'success' });
        history.push('/app/holdings');
    }

    return (
        <Formik
            initialValues={{
                price: holding.price || '3',
                quantity: holding.quantity || '3',
                symbol: holding.symbol || 'A',
                comments: holding.comments || '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                price: Yup.number().required('Price per share is required'),
                quantity: Yup.number().required('Number of shares are required'),
                symbol: Yup.string().max(255).required('Symbol is required'),
                comments: Yup.string()
            })}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    Cache.clear();

                    if (holding.id) {
                        await API.graphql(graphqlOperation(updateHolding, {
                            input:
                            {
                                id: holding.id,
                                price: values.price,
                                comments: values.comments,
                                quantity: values.quantity,
                                symbol: String(values.symbol).toUpperCase(),
                            }
                        }));
                    } else {
                        const { attributes } = await Auth.currentAuthenticatedUser();
                        // "Symbol": "AAPL",
                        // "Quantity": 16,
                        // "Trade Price": -60,
                        // const holdings = [
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "AAPL",
                        //       "Type": "STOCK",
                        //       "Quantity": 16,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 147.75,
                        //       "P/L Day": 16.8,
                        //       "P/L Open w/ Percent Bar": "1,404.00",
                        //       "Cost": -960,
                        //       "Delta": 16,
                        //       "Bid": 147.75,
                        //       "Ask": 147.76,
                        //       "PoP": "50%",
                        //       "IV Rank": 17.8,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 6.29,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -60
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "ABBV",
                        //       "Type": "STOCK",
                        //       "Quantity": 14,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 118.85,
                        //       "P/L Day": 12.91,
                        //       "P/L Open w/ Percent Bar": 649.35,
                        //       "Cost": "-1,014.58",
                        //       "Delta": 14,
                        //       "Bid": 118.85,
                        //       "Ask": 118.86,
                        //       "PoP": "50%",
                        //       "IV Rank": 12.8,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 2.95,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -72.47
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "ACC",
                        //       "Type": "STOCK",
                        //       "Quantity": 150,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 49.15,
                        //       "P/L Day": 106.5,
                        //       "P/L Open w/ Percent Bar": "2,843.70",
                        //       "Cost": "-4,528.80",
                        //       "Delta": 150,
                        //       "Bid": 49.14,
                        //       "Ask": 49.18,
                        //       "PoP": "50%",
                        //       "IV Rank": 3.7,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 16.86,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -30.19
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "AVB",
                        //       "Type": "STOCK",
                        //       "Quantity": 35,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 225.17,
                        //       "P/L Day": 42.7,
                        //       "P/L Open w/ Percent Bar": "2,418.50",
                        //       "Cost": "-5,462.45",
                        //       "Delta": 35,
                        //       "Bid": 225.06,
                        //       "Ask": 225.21,
                        //       "PoP": "50%",
                        //       "IV Rank": 8.4,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 17.75,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -156.07
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "BPYPP",
                        //       "Type": "STOCK",
                        //       "Quantity": 50,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 25.77,
                        //       "P/L Day": 6,
                        //       "P/L Open w/ Percent Bar": 293,
                        //       "Cost": -995.5,
                        //       "Delta": 50,
                        //       "Bid": 25.76,
                        //       "Ask": 25.87,
                        //       "PoP": "50%",
                        //       "IV Rank": "--",
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 0,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -19.91
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "BRX",
                        //       "Type": "STOCK",
                        //       "Quantity": 500,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 22.7,
                        //       "P/L Day": 125,
                        //       "P/L Open w/ Percent Bar": "5,436.69",
                        //       "Cost": "-5,913.31",
                        //       "Delta": 500,
                        //       "Bid": 22.7,
                        //       "Ask": 22.71,
                        //       "PoP": "50%",
                        //       "IV Rank": 14.7,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 47.5,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -11.83
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "DOC",
                        //       "Type": "STOCK",
                        //       "Quantity": 300,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 18.57,
                        //       "P/L Day": 21,
                        //       "P/L Open w/ Percent Bar": 630.28,
                        //       "Cost": "-4,940.72",
                        //       "Delta": 300,
                        //       "Bid": 18.57,
                        //       "Ask": 18.58,
                        //       "PoP": "50%",
                        //       "IV Rank": 11.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 11.14,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -16.47
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "ENB",
                        //       "Type": "STOCK",
                        //       "Quantity": 32,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 37.78,
                        //       "P/L Day": 15.04,
                        //       "P/L Open w/ Percent Bar": 288.96,
                        //       "Cost": -920,
                        //       "Delta": 32,
                        //       "Bid": 37.77,
                        //       "Ask": 37.78,
                        //       "PoP": "50%",
                        //       "IV Rank": 9.1,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 2.47,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -28.75
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "EPR",
                        //       "Type": "STOCK",
                        //       "Quantity": 470,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 47.43,
                        //       "P/L Day": 103.4,
                        //       "P/L Open w/ Percent Bar": "1,236.70",
                        //       "Cost": "-21,055.40",
                        //       "Delta": 470,
                        //       "Bid": 47.44,
                        //       "Ask": 47.5,
                        //       "PoP": "50%",
                        //       "IV Rank": 11.4,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 109.29,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -44.8
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "FRT",
                        //       "Type": "STOCK",
                        //       "Quantity": 70,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 116.44,
                        //       "P/L Day": 82.6,
                        //       "P/L Open w/ Percent Bar": "2,299.80",
                        //       "Cost": "-5,851.00",
                        //       "Delta": 70,
                        //       "Bid": 116.44,
                        //       "Ask": 116.54,
                        //       "PoP": "50%",
                        //       "IV Rank": 33.2,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 23.08,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -83.59
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "GEO",
                        //       "Type": "STOCK",
                        //       "Quantity": 450,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 7.92,
                        //       "P/L Day": -78.75,
                        //       "P/L Open w/ Percent Bar": "-1,705.25",
                        //       "Cost": "-5,271.50",
                        //       "Delta": 450,
                        //       "Bid": 7.92,
                        //       "Ask": 7.93,
                        //       "PoP": "50%",
                        //       "IV Rank": 28.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 5.66,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -11.71
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "GPC",
                        //       "Type": "STOCK",
                        //       "Quantity": 400,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 123.72,
                        //       "P/L Day": 488,
                        //       "P/L Open w/ Percent Bar": "36,641.60",
                        //       "Cost": "-12,846.40",
                        //       "Delta": 400,
                        //       "Bid": 123.71,
                        //       "Ask": 123.76,
                        //       "PoP": "50%",
                        //       "IV Rank": 4,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 129.28,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -32.12
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "HBI",
                        //       "Type": "STOCK",
                        //       "Quantity": 300,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 18.8,
                        //       "P/L Day": 60,
                        //       "P/L Open w/ Percent Bar": -360,
                        //       "Cost": "-6,000.00",
                        //       "Delta": 300,
                        //       "Bid": 18.8,
                        //       "Ask": 18.81,
                        //       "PoP": "50%",
                        //       "IV Rank": 9.2,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 21.59,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -20
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "IRT",
                        //       "Type": "STOCK",
                        //       "Quantity": 780,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 20.38,
                        //       "P/L Day": 452.4,
                        //       "P/L Open w/ Percent Bar": "8,103.45",
                        //       "Cost": "-7,792.95",
                        //       "Delta": 780,
                        //       "Bid": 20.37,
                        //       "Ask": 20.38,
                        //       "PoP": "50%",
                        //       "IV Rank": 8,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 36.88,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -9.99
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "KMI",
                        //       "Type": "STOCK",
                        //       "Quantity": 80,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 15.93,
                        //       "P/L Day": 3.6,
                        //       "P/L Open w/ Percent Bar": 124.4,
                        //       "Cost": "-1,150.40",
                        //       "Delta": 80,
                        //       "Bid": 15.93,
                        //       "Ask": 15.94,
                        //       "PoP": "50%",
                        //       "IV Rank": 22.4,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 3.32,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -14.38
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "LADR",
                        //       "Type": "STOCK",
                        //       "Quantity": 350,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 11.12,
                        //       "P/L Day": 50.75,
                        //       "P/L Open w/ Percent Bar": 927.25,
                        //       "Cost": "-2,966.50",
                        //       "Delta": 350,
                        //       "Bid": 11.12,
                        //       "Ask": 11.13,
                        //       "PoP": "50%",
                        //       "IV Rank": 14.1,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 21.07,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -8.48
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "LEG",
                        //       "Type": "STOCK",
                        //       "Quantity": 80,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 47.71,
                        //       "P/L Day": 65.6,
                        //       "P/L Open w/ Percent Bar": "1,829.04",
                        //       "Cost": "-1,987.76",
                        //       "Delta": 80,
                        //       "Bid": 47.7,
                        //       "Ask": 47.72,
                        //       "PoP": "50%",
                        //       "IV Rank": 24.4,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 13.49,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -24.85
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "LTC",
                        //       "Type": "STOCK",
                        //       "Quantity": 74,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 34.19,
                        //       "P/L Day": -11.84,
                        //       "P/L Open w/ Percent Bar": 520.02,
                        //       "Cost": "-2,010.04",
                        //       "Delta": 74,
                        //       "Bid": 34.18,
                        //       "Ask": 34.21,
                        //       "PoP": "50%",
                        //       "IV Rank": 26.2,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 5.89,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -27.16
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "MAC",
                        //       "Type": "STOCK",
                        //       "Quantity": 100,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 15.6,
                        //       "P/L Day": 24,
                        //       "P/L Open w/ Percent Bar": 952,
                        //       "Cost": -608,
                        //       "Delta": 100,
                        //       "Bid": 15.59,
                        //       "Ask": 15.6,
                        //       "PoP": "50%",
                        //       "IV Rank": 4.9,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 7.44,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -6.08
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "MPW",
                        //       "Type": "STOCK",
                        //       "Quantity": 950,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 19.92,
                        //       "P/L Day": 251.75,
                        //       "P/L Open w/ Percent Bar": 919.51,
                        //       "Cost": "-18,009.24",
                        //       "Delta": 950,
                        //       "Bid": 19.92,
                        //       "Ask": 19.93,
                        //       "PoP": "50%",
                        //       "IV Rank": 26,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 23.48,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -18.96
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "NNN",
                        //       "Type": "STOCK",
                        //       "Quantity": 220,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 47.04,
                        //       "P/L Day": 59.4,
                        //       "P/L Open w/ Percent Bar": "1,517.78",
                        //       "Cost": "-8,831.02",
                        //       "Delta": 220,
                        //       "Bid": 47.03,
                        //       "Ask": 47.04,
                        //       "PoP": "50%",
                        //       "IV Rank": 5.6,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 21.18,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -40.14
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "O",
                        //       "Type": "STOCK",
                        //       "Quantity": 150,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 72.23,
                        //       "P/L Day": 103.5,
                        //       "P/L Open w/ Percent Bar": "1,963.50",
                        //       "Cost": "-8,871.00",
                        //       "Delta": 150,
                        //       "Bid": 72.23,
                        //       "Ask": 72.24,
                        //       "PoP": "50%",
                        //       "IV Rank": 27.3,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 20.25,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -59.14
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "RDS/B",
                        //       "Type": "STOCK",
                        //       "Quantity": 250,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 37.58,
                        //       "P/L Day": -27.5,
                        //       "P/L Open w/ Percent Bar": "1,428.13",
                        //       "Cost": "-7,966.87",
                        //       "Delta": 250,
                        //       "Bid": 37.58,
                        //       "Ask": 37.59,
                        //       "PoP": "50%",
                        //       "IV Rank": 9.3,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 22.92,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -31.87
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "SPG",
                        //       "Type": "STOCK",
                        //       "Quantity": 38,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 129.06,
                        //       "P/L Day": 22.8,
                        //       "P/L Open w/ Percent Bar": "1,583.56",
                        //       "Cost": "-3,320.72",
                        //       "Delta": 38,
                        //       "Bid": 128.99,
                        //       "Ask": 129.03,
                        //       "PoP": "50%",
                        //       "IV Rank": 10.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 20.32,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -87.39
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "STAG",
                        //       "Type": "STOCK",
                        //       "Quantity": 227,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 42.13,
                        //       "P/L Day": 73.77,
                        //       "P/L Open w/ Percent Bar": "3,247.83",
                        //       "Cost": "-6,316.81",
                        //       "Delta": 227,
                        //       "Bid": 42.13,
                        //       "Ask": 42.14,
                        //       "PoP": "50%",
                        //       "IV Rank": 25.7,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 20.03,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -27.83
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "STAR",
                        //       "Type": "STOCK",
                        //       "Quantity": 450,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 25.26,
                        //       "P/L Day": 34.87,
                        //       "P/L Open w/ Percent Bar": "1,326.46",
                        //       "Cost": "-10,039.42",
                        //       "Delta": 450,
                        //       "Bid": 25.25,
                        //       "Ask": 25.26,
                        //       "PoP": "50%",
                        //       "IV Rank": 7.7,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 21.01,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -22.31
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "STOR",
                        //       "Type": "STOCK",
                        //       "Quantity": 550,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 35.43,
                        //       "P/L Day": 214.5,
                        //       "P/L Open w/ Percent Bar": "6,493.62",
                        //       "Cost": "-12,992.88",
                        //       "Delta": 550,
                        //       "Bid": 35.42,
                        //       "Ask": 35.43,
                        //       "PoP": "50%",
                        //       "IV Rank": 5.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 62.23,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -23.62
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "UMH",
                        //       "Type": "STOCK",
                        //       "Quantity": 500,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 23.29,
                        //       "P/L Day": 250,
                        //       "P/L Open w/ Percent Bar": "5,811.67",
                        //       "Cost": "-5,833.33",
                        //       "Delta": 500,
                        //       "Bid": 23.28,
                        //       "Ask": 23.31,
                        //       "PoP": "50%",
                        //       "IV Rank": 18.3,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 30.25,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -11.67
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "VICI",
                        //       "Type": "STOCK",
                        //       "Quantity": 750,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 29.37,
                        //       "P/L Day": 78.75,
                        //       "P/L Open w/ Percent Bar": "3,102.97",
                        //       "Cost": "-18,928.28",
                        //       "Delta": 750,
                        //       "Bid": 29.37,
                        //       "Ask": 29.38,
                        //       "PoP": "50%",
                        //       "IV Rank": 7.7,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 53.08,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -25.24
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "VST",
                        //       "Type": "STOCK",
                        //       "Quantity": 300,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 18.1,
                        //       "P/L Day": 90,
                        //       "P/L Open w/ Percent Bar": 117.51,
                        //       "Cost": "-5,312.49",
                        //       "Delta": 300,
                        //       "Bid": 18.09,
                        //       "Ask": 18.1,
                        //       "PoP": "50%",
                        //       "IV Rank": 27.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 11.18,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -17.71
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "WPC",
                        //       "Type": "STOCK",
                        //       "Quantity": 50,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 77.78,
                        //       "P/L Day": 32,
                        //       "P/L Open w/ Percent Bar": "1,125.45",
                        //       "Cost": "-2,763.55",
                        //       "Delta": 50,
                        //       "Bid": 77.77,
                        //       "Ask": 77.81,
                        //       "PoP": "50%",
                        //       "IV Rank": 21.2,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 6.84,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -55.27
                        //     },
                        //     {
                        //       "Account": "5WV68303",
                        //       "Symbol": "WSR",
                        //       "Type": "STOCK",
                        //       "Quantity": 1400,
                        //       "Exp Date": "",
                        //       "DTE": "--",
                        //       "Strike Price": "",
                        //       "Call/Put": "",
                        //       "Underlying Last Price": 9.61,
                        //       "P/L Day": 406,
                        //       "P/L Open w/ Percent Bar": "1,239.13",
                        //       "Cost": "-12,214.87",
                        //       "Delta": "1,400.00",
                        //       "Bid": 9.61,
                        //       "Ask": 9.62,
                        //       "PoP": "50%",
                        //       "IV Rank": 6.5,
                        //       "D's Opn": "",
                        //       "Days To Expiration": "--",
                        //       "β Delta": 43.5,
                        //       "Gamma": 0,
                        //       "Theta": 0,
                        //       "Trade Price": -8.72
                        //     }
                        //   ]

                        // for (const holding of holdings) {
                        //     await API.graphql(graphqlOperation(createHolding, {
                        //         input: {
                        //             price: Number(String(holding['Trade Price']).split('-')[1]),
                        //             comments: 'Imported',
                        //             quantity: holding.Quantity,
                        //             owner: attributes.sub,
                        //             symbol: holding.Symbol
                        //         }
                        //     }));
                        // }

                        await API.graphql(graphqlOperation(createHolding, {
                            input: {
                                price: values.price,
                                comments: values.comments,
                                quantity: values.quantity,
                                owner: attributes.sub,
                                symbol: String(values.symbol).toUpperCase(),
                            }
                        }));
                    }
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    history.push('/app/holdings');
                    enqueueSnackbar(holding.id ? 'Holding Updated' : 'Holding Added', {
                        variant: 'success',
                    });
                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                setFieldValue
            }) => (
                <form
                    className={clsx(classes.root, className)}
                    onSubmit={handleSubmit}
                    {...rest}
                >
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.symbol && errors.symbol)}
                                        fullWidth
                                        helperText={touched.symbol && errors.symbol}
                                        autoComplete='off'
                                        label="Symbol"
                                        name="symbol"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.symbol.toUpperCase()}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} />
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.quantity && errors.quantity)}
                                        fullWidth
                                        helperText={touched.quantity && errors.quantity}
                                        label="Quantity"
                                        name="quantity"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.quantity}
                                        variant="outlined"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} />
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.price && errors.price)}
                                        fullWidth
                                        helperText={touched.price && errors.price}
                                        label="Price per Share"
                                        name="price"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.price}
                                        variant="outlined"
                                        type='number'
                                        required
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} />
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.comments && errors.comments)}
                                        fullWidth
                                        multiline
                                        helperText={touched.comments && errors.comments}
                                        label='Comments'
                                        name='comments'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.comments}
                                        variant='outlined'
                                        autoCapitalize='on'
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} />
                            </Grid>
                            <Box mt={2} className={classes.buttonsBar}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {holding.id ? 'Update Holding' : 'Add Holding'}
                                </Button>
                                {holding.id && (
                                    <IconButton onClick={handleDeleteClick}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}

                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
};
