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
                        //         "Account": "5WV68303",
                        //         "Symbol": "AAPL",
                        //         "Type": "STOCK",
                        //         "Quantity": 16,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 145.11,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,361.76",
                        //         "Cost": -960,
                        //         "Delta": 16,
                        //         "Bid": 145.07,
                        //         "Ask": 145.08,
                        //         "PoP": "50%",
                        //         "IV Rank": 21.7,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 6.27,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -60
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "ABBV",
                        //         "Type": "STOCK",
                        //         "Quantity": 14,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 116.58,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 617.54,
                        //         "Cost": "-1,014.58",
                        //         "Delta": 14,
                        //         "Bid": 116.35,
                        //         "Ask": 116.76,
                        //         "PoP": "50%",
                        //         "IV Rank": 19.3,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 2.94,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -72.47
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "ACC",
                        //         "Type": "STOCK",
                        //         "Quantity": 150,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 49.26,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,860.20",
                        //         "Cost": "-4,528.80",
                        //         "Delta": 150,
                        //         "Bid": 47.5,
                        //         "Ask": 49.33,
                        //         "PoP": "50%",
                        //         "IV Rank": 7.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 17.21,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -30.19
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "AVB",
                        //         "Type": "STOCK",
                        //         "Quantity": 35,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 220.83,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,266.60",
                        //         "Cost": "-5,462.45",
                        //         "Delta": 35,
                        //         "Bid": 220.83,
                        //         "Ask": 400,
                        //         "PoP": "50%",
                        //         "IV Rank": 10.6,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 17.69,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -156.07
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "AXP",
                        //         "Type": "STOCK",
                        //         "Quantity": 26,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 171.94,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,389.79",
                        //         "Cost": "-2,080.65",
                        //         "Delta": 26,
                        //         "Bid": 171.45,
                        //         "Ask": 172.26,
                        //         "PoP": "50%",
                        //         "IV Rank": 8,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 13.41,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -80.02
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "BPYPP",
                        //         "Type": "STOCK",
                        //         "Quantity": 50,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 26.01,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 305,
                        //         "Cost": -995.5,
                        //         "Delta": 50,
                        //         "Bid": 23.87,
                        //         "Ask": 26.3,
                        //         "PoP": "50%",
                        //         "IV Rank": "--",
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 0,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -19.91
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "BRK/B",
                        //         "Type": "STOCK",
                        //         "Quantity": 20,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 280.49,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,061.01",
                        //         "Cost": "-3,548.79",
                        //         "Delta": 20,
                        //         "Bid": 280.53,
                        //         "Ask": 280.59,
                        //         "PoP": "50%",
                        //         "IV Rank": 13.4,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 11.39,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -177.44
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "BRX",
                        //         "Type": "STOCK",
                        //         "Quantity": 900,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 23.19,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "11,130.65",
                        //         "Cost": "-9,740.35",
                        //         "Delta": 900,
                        //         "Bid": 20.98,
                        //         "Ask": 23.19,
                        //         "PoP": "50%",
                        //         "IV Rank": 14.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 88.71,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -10.82
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "BX",
                        //         "Type": "STOCK",
                        //         "Quantity": 21,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 99.73,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,082.76",
                        //         "Cost": "-1,011.57",
                        //         "Delta": 21,
                        //         "Bid": 99.75,
                        //         "Ask": 99.95,
                        //         "PoP": "50%",
                        //         "IV Rank": 13.5,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 6.33,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -48.17
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "DFS",
                        //         "Type": "STOCK",
                        //         "Quantity": 80,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 122.4,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "6,466.20",
                        //         "Cost": "-3,325.80",
                        //         "Delta": 80,
                        //         "Bid": 122.49,
                        //         "Ask": 122.99,
                        //         "PoP": "50%",
                        //         "IV Rank": 16.3,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 45.46,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -41.57
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "DOC",
                        //         "Type": "STOCK",
                        //         "Quantity": 200,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 18.64,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 612.1,
                        //         "Cost": "-3,115.90",
                        //         "Delta": 200,
                        //         "Bid": 18.35,
                        //         "Ask": 18.72,
                        //         "PoP": "50%",
                        //         "IV Rank": 4.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 7.51,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -15.58
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "ENB",
                        //         "Type": "STOCK",
                        //         "Quantity": 32,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 40.25,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 368,
                        //         "Cost": -920,
                        //         "Delta": 32,
                        //         "Bid": 40.04,
                        //         "Ask": 40.49,
                        //         "PoP": "50%",
                        //         "IV Rank": 16.6,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 2.68,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -28.75
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "EPR",
                        //         "Type": "STOCK",
                        //         "Quantity": 100,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 52.64,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,581.90",
                        //         "Cost": "-2,682.10",
                        //         "Delta": 100,
                        //         "Bid": 49,
                        //         "Ask": 53.18,
                        //         "PoP": "50%",
                        //         "IV Rank": -7.5,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 26.28,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -26.82
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "FRT",
                        //         "Type": "STOCK",
                        //         "Quantity": 70,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 118.05,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,412.50",
                        //         "Cost": "-5,851.00",
                        //         "Delta": 70,
                        //         "Bid": 102.83,
                        //         "Ask": 120,
                        //         "PoP": "50%",
                        //         "IV Rank": 12.7,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 23.9,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -83.59
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "GEO",
                        //         "Type": "STOCK",
                        //         "Quantity": 450,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 7.14,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "-2,058.50",
                        //         "Cost": "-5,271.50",
                        //         "Delta": 450,
                        //         "Bid": 7.1,
                        //         "Ask": 7.18,
                        //         "PoP": "50%",
                        //         "IV Rank": 27.2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 5.61,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -11.71
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "GPC",
                        //         "Type": "STOCK",
                        //         "Quantity": 400,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 129.52,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "38,961.60",
                        //         "Cost": "-12,846.40",
                        //         "Delta": 400,
                        //         "Bid": 120,
                        //         "Ask": 132.54,
                        //         "PoP": "50%",
                        //         "IV Rank": 18.7,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 137.55,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -32.12
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "HBI",
                        //         "Type": "STOCK",
                        //         "Quantity": 300,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 18.1,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": -570,
                        //         "Cost": "-6,000.00",
                        //         "Delta": 300,
                        //         "Bid": 17.37,
                        //         "Ask": 18.48,
                        //         "PoP": "50%",
                        //         "IV Rank": 31.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 21.14,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -20
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "HT",
                        //         "Type": "STOCK",
                        //         "Quantity": 100,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 10.34,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 439,
                        //         "Cost": -595,
                        //         "Delta": 100,
                        //         "Bid": 10.11,
                        //         "Ask": 12.37,
                        //         "PoP": "50%",
                        //         "IV Rank": 14.8,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 7.63,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -5.95
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "IRT",
                        //         "Type": "STOCK",
                        //         "Quantity": 780,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 18.97,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "7,003.65",
                        //         "Cost": "-7,792.95",
                        //         "Delta": 780,
                        //         "Bid": 9.5,
                        //         "Ask": 22,
                        //         "PoP": "50%",
                        //         "IV Rank": 18.5,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 34.41,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -9.99
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "JNJ",
                        //         "Type": "STOCK",
                        //         "Quantity": 8,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 169.75,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 335.12,
                        //         "Cost": "-1,022.88",
                        //         "Delta": 8,
                        //         "Bid": 169.7,
                        //         "Ask": 169.75,
                        //         "PoP": "50%",
                        //         "IV Rank": 11.7,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 2.19,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -127.86
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "JPM",
                        //         "Type": "STOCK",
                        //         "Quantity": 40,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 155.77,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,520.80",
                        //         "Cost": "-3,710.00",
                        //         "Delta": 40,
                        //         "Bid": 155.55,
                        //         "Ask": 155.9,
                        //         "PoP": "50%",
                        //         "IV Rank": 8.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 17.43,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -92.75
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "KMI",
                        //         "Type": "STOCK",
                        //         "Quantity": 80,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 18.67,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 343.2,
                        //         "Cost": "-1,150.40",
                        //         "Delta": 80,
                        //         "Bid": 18.65,
                        //         "Ask": 18.68,
                        //         "PoP": "50%",
                        //         "IV Rank": 6.8,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 3.93,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -14.38
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "KOF",
                        //         "Type": "STOCK",
                        //         "Quantity": 100,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 52.59,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 581.03,
                        //         "Cost": "-4,677.97",
                        //         "Delta": 100,
                        //         "Bid": 47,
                        //         "Ask": 102.5,
                        //         "PoP": "50%",
                        //         "IV Rank": 2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 10.92,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -46.78
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "LADR",
                        //         "Type": "STOCK",
                        //         "Quantity": 350,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 11.41,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,027.00",
                        //         "Cost": "-2,966.50",
                        //         "Delta": 350,
                        //         "Bid": 10.71,
                        //         "Ask": 11.47,
                        //         "PoP": "50%",
                        //         "IV Rank": 8,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 21.95,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -8.48
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "LEG",
                        //         "Type": "STOCK",
                        //         "Quantity": 80,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 50.88,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,082.64",
                        //         "Cost": "-1,987.76",
                        //         "Delta": 80,
                        //         "Bid": 50.1,
                        //         "Ask": 53.91,
                        //         "PoP": "50%",
                        //         "IV Rank": 20.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 14.69,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -24.85
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "LTC",
                        //         "Type": "STOCK",
                        //         "Quantity": 74,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 38.97,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 873.74,
                        //         "Cost": "-2,010.04",
                        //         "Delta": 74,
                        //         "Bid": 38.1,
                        //         "Ask": 39,
                        //         "PoP": "50%",
                        //         "IV Rank": 18,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 6.85,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -27.16
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "MAC",
                        //         "Type": "STOCK",
                        //         "Quantity": 100,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 17.88,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,180.00",
                        //         "Cost": -608,
                        //         "Delta": 100,
                        //         "Bid": 17.67,
                        //         "Ask": 17.83,
                        //         "PoP": "50%",
                        //         "IV Rank": 3.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 8.73,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -6.08
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "MPW",
                        //         "Type": "STOCK",
                        //         "Quantity": 350,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 20.5,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,124.00",
                        //         "Cost": "-6,051.00",
                        //         "Delta": 350,
                        //         "Bid": 20.2,
                        //         "Ask": 20.49,
                        //         "PoP": "50%",
                        //         "IV Rank": 22.6,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 9,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -17.29
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "MS",
                        //         "Type": "STOCK",
                        //         "Quantity": 27,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 90.33,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,442.88",
                        //         "Cost": -996.03,
                        //         "Delta": 27,
                        //         "Bid": 90.17,
                        //         "Ask": 90.34,
                        //         "PoP": "50%",
                        //         "IV Rank": 18.4,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 8.65,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -36.89
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "NNN",
                        //         "Type": "STOCK",
                        //         "Quantity": 220,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 47.67,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,656.38",
                        //         "Cost": "-8,831.02",
                        //         "Delta": 220,
                        //         "Bid": 47.01,
                        //         "Ask": 48.65,
                        //         "PoP": "50%",
                        //         "IV Rank": 4.5,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 21.7,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -40.14
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "O",
                        //         "Type": "STOCK",
                        //         "Quantity": 150,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 68.87,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,459.50",
                        //         "Cost": "-8,871.00",
                        //         "Delta": 150,
                        //         "Bid": 68.84,
                        //         "Ask": 68.98,
                        //         "PoP": "50%",
                        //         "IV Rank": 16.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 19.77,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -59.14
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "PFF",
                        //         "Type": "STOCK",
                        //         "Quantity": 35,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 39.32,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 371,
                        //         "Cost": "-1,005.20",
                        //         "Delta": 35,
                        //         "Bid": 39.3,
                        //         "Ask": 39.4,
                        //         "PoP": "50%",
                        //         "IV Rank": -17.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 1.47,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -28.72
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "RDS/B",
                        //         "Type": "STOCK",
                        //         "Quantity": 250,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 39.7,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,958.13",
                        //         "Cost": "-7,966.87",
                        //         "Delta": 250,
                        //         "Bid": 39.7,
                        //         "Ask": 39.72,
                        //         "PoP": "50%",
                        //         "IV Rank": 21.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 24.37,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -31.87
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "SPG",
                        //         "Type": "STOCK",
                        //         "Quantity": 38,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 129.69,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,607.50",
                        //         "Cost": "-3,320.72",
                        //         "Delta": 38,
                        //         "Bid": 129.01,
                        //         "Ask": 129.8,
                        //         "PoP": "50%",
                        //         "IV Rank": 7.6,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 20.84,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -87.39
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "STAG",
                        //         "Type": "STOCK",
                        //         "Quantity": 227,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 39.04,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "2,545.27",
                        //         "Cost": "-6,316.81",
                        //         "Delta": 227,
                        //         "Bid": 39,
                        //         "Ask": 39.29,
                        //         "PoP": "50%",
                        //         "IV Rank": 24.2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 18.79,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -27.83
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "STAR",
                        //         "Type": "STOCK",
                        //         "Quantity": 200,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 22.71,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 854.38,
                        //         "Cost": "-3,687.62",
                        //         "Delta": 200,
                        //         "Bid": 22.71,
                        //         "Ask": 22.95,
                        //         "PoP": "50%",
                        //         "IV Rank": 19.2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 8.33,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -18.44
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "STOR",
                        //         "Type": "STOCK",
                        //         "Quantity": 500,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 35.89,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "6,737.51",
                        //         "Cost": "-11,207.49",
                        //         "Delta": 500,
                        //         "Bid": 35.08,
                        //         "Ask": 35.99,
                        //         "PoP": "50%",
                        //         "IV Rank": 3.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 58.55,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -22.41
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "T",
                        //         "Type": "STOCK",
                        //         "Quantity": 36,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 28.45,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 7.92,
                        //         "Cost": "-1,016.28",
                        //         "Delta": 36,
                        //         "Bid": 28.44,
                        //         "Ask": 28.45,
                        //         "PoP": "50%",
                        //         "IV Rank": 13.2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 1.84,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -28.23
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "UMH",
                        //         "Type": "STOCK",
                        //         "Quantity": 500,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 22.03,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "5,181.67",
                        //         "Cost": "-5,833.33",
                        //         "Delta": 500,
                        //         "Bid": 11.99,
                        //         "Ask": 25,
                        //         "PoP": "50%",
                        //         "IV Rank": 0.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 29.1,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -11.67
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "VICI",
                        //         "Type": "STOCK",
                        //         "Quantity": 400,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 31.44,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "4,182.05",
                        //         "Cost": "-8,393.95",
                        //         "Delta": 400,
                        //         "Bid": 30.5,
                        //         "Ask": 32.28,
                        //         "PoP": "50%",
                        //         "IV Rank": 27.4,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 30.57,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -20.98
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "VNQI",
                        //         "Type": "STOCK",
                        //         "Quantity": 26,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 59.67,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 518.7,
                        //         "Cost": "-1,032.72",
                        //         "Delta": 26,
                        //         "Bid": 54.88,
                        //         "Ask": 63.75,
                        //         "PoP": "50%",
                        //         "IV Rank": -2.8,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 2.91,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -39.72
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "VOO",
                        //         "Type": "STOCK",
                        //         "Quantity": 4,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 400.37,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 680.96,
                        //         "Cost": -920.52,
                        //         "Delta": 4,
                        //         "Bid": 400.01,
                        //         "Ask": 400.86,
                        //         "PoP": "50%",
                        //         "IV Rank": 4.1,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 3.69,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -230.13
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "VST",
                        //         "Type": "STOCK",
                        //         "Quantity": 300,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 19.32,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": 483.51,
                        //         "Cost": "-5,312.49",
                        //         "Delta": 300,
                        //         "Bid": 19.21,
                        //         "Ask": 19.32,
                        //         "PoP": "50%",
                        //         "IV Rank": 34.9,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 11.84,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -17.71
                        //     },
                        //     {
                        //         "Account": "5WV68303",
                        //         "Symbol": "WPC",
                        //         "Type": "STOCK",
                        //         "Quantity": 50,
                        //         "Exp Date": "",
                        //         "DTE": "--",
                        //         "Strike Price": "",
                        //         "Call/Put": "",
                        //         "Underlying Last Price": 77.97,
                        //         "P/L Day": 0,
                        //         "P/L Open w/ Percent Bar": "1,134.95",
                        //         "Cost": "-2,763.55",
                        //         "Delta": 50,
                        //         "Bid": 76,
                        //         "Ask": 78.25,
                        //         "PoP": "50%",
                        //         "IV Rank": 4.2,
                        //         "D's Opn": "",
                        //         "Days To Expiration": "--",
                        //         "β Delta": 6.81,
                        //         "Gamma": 0,
                        //         "Theta": 0,
                        //         "Trade Price": -55.27
                        //     }
                        // ]

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
