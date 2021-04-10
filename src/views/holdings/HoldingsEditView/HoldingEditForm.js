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
import { API, graphqlOperation, Auth } from 'aws-amplify';

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
        // await API.del('holdingsApi', '/holdings', { body: { id: holding.id, } });

        await API.graphql(graphqlOperation(deleteHolding, { input: { id: holding.id } }));
        enqueueSnackbar('Holding Deleted', { variant: 'success' });
        history.push('/app/holdings');
    }

    return (
        <Formik
            initialValues={{
                price: holding.price || '',
                quantity: holding.quantity || '',
                symbol: holding.symbol || '',
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
                        const holdings = [
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "AAPL",
                            //   "Type": "STOCK",
                            //   "Quantity": 16,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "2/05",
                            //   "Trade Price": -60,
                            //   "P/L Day": 21.44,
                            //   "P/L Open": "1,080.80",
                            //   "Cost": -960,
                            //   "Delta": 16,
                            //   "Theta": 0,
                            //   "Bid": 127.54,
                            //   "Ask": 127.55,
                            //   "PoP": "50%",
                            //   "IV Rank": 12.3,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 5.93,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "ABBV",
                            //   "Type": "STOCK",
                            //   "Quantity": 14,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "4/14",
                            //   "Trade Price": -72.47,
                            //   "P/L Day": -12.04,
                            //   "P/L Open": 448.7,
                            //   "Cost": "-1,014.58",
                            //   "Delta": 14,
                            //   "Theta": 0,
                            //   "Bid": 104.51,
                            //   "Ask": 104.53,
                            //   "PoP": "50%",
                            //   "IV Rank": 6.8,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 2.9,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "ACC",
                            //   "Type": "STOCK",
                            //   "Quantity": 150,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "1/27",
                            //   "Trade Price": -30.19,
                            //   "P/L Day": -12.75,
                            //   "P/L Open": "2,073.45",
                            //   "Cost": "-4,528.80",
                            //   "Delta": 150,
                            //   "Theta": 0,
                            //   "Bid": 44,
                            //   "Ask": 44.01,
                            //   "PoP": "50%",
                            //   "IV Rank": 9.8,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 16.32,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "AMD",
                            //   "Type": "STOCK",
                            //   "Quantity": 24,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "",
                            //   "Trade Price": -42.23,
                            //   "P/L Day": 28.8,
                            //   "P/L Open": 969.84,
                            //   "Cost": "-1,013.52",
                            //   "Delta": 24,
                            //   "Theta": 0,
                            //   "Bid": 82.63,
                            //   "Ask": 82.64,
                            //   "PoP": "50%",
                            //   "IV Rank": 5.5,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 8.7,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "AVB",
                            //   "Type": "STOCK",
                            //   "Quantity": 35,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "3/30",
                            //   "Trade Price": -156.07,
                            //   "P/L Day": 10.85,
                            //   "P/L Open": "1,075.90",
                            //   "Cost": "-5,462.45",
                            //   "Delta": 35,
                            //   "Theta": 0,
                            //   "Bid": 186.75,
                            //   "Ask": 186.91,
                            //   "PoP": "50%",
                            //   "IV Rank": 11.9,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 16.1,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "AXP",
                            //   "Type": "STOCK",
                            //   "Quantity": 26,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "3/31",
                            //   "Trade Price": -80.03,
                            //   "P/L Day": 17.42,
                            //   "P/L Open": "1,736.67",
                            //   "Cost": "-2,080.65",
                            //   "Delta": 26,
                            //   "Theta": 0,
                            //   "Bid": 146.79,
                            //   "Ask": 146.83,
                            //   "PoP": "50%",
                            //   "IV Rank": 1.1,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 12.31,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "BPYPP",
                            //   "Type": "STOCK",
                            //   "Quantity": 50,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "5/29",
                            //   "Trade Price": -19.91,
                            //   "P/L Day": -0.8,
                            //   "P/L Open": 275.2,
                            //   "Cost": -995.5,
                            //   "Delta": 50,
                            //   "Theta": 0,
                            //   "Bid": 25.33,
                            //   "Ask": 25.45,
                            //   "PoP": "50%",
                            //   "IV Rank": "--",
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 0,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "BRK/B",
                            //   "Type": "STOCK",
                            //   "Quantity": 20,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "",
                            //   "Trade Price": -177.44,
                            //   "P/L Day": 8.6,
                            //   "P/L Open": "1,721.01",
                            //   "Cost": "-3,548.79",
                            //   "Delta": 20,
                            //   "Theta": 0,
                            //   "Bid": 263.48,
                            //   "Ask": 263.51,
                            //   "PoP": "50%",
                            //   "IV Rank": 2.9,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 11.33,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "BRX",
                            //   "Type": "STOCK",
                            //   "Quantity": 900,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "4/01",
                            //   "Trade Price": -10.82,
                            //   "P/L Day": -166.5,
                            //   "P/L Open": "8,705.15",
                            //   "Cost": "-9,740.35",
                            //   "Delta": 900,
                            //   "Theta": 0,
                            //   "Bid": 20.49,
                            //   "Ask": 20.5,
                            //   "PoP": "50%",
                            //   "IV Rank": 9.8,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 83.71,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "BX",
                            //   "Type": "STOCK",
                            //   "Quantity": 21,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "2/05",
                            //   "Trade Price": -48.17,
                            //   "P/L Day": 11.34,
                            //   "P/L Open": 566.79,
                            //   "Cost": "-1,011.57",
                            //   "Delta": 21,
                            //   "Theta": 0,
                            //   "Bid": 75.15,
                            //   "Ask": 75.18,
                            //   "PoP": "50%",
                            //   "IV Rank": -0.1,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 5.02,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "DFS",
                            //   "Type": "STOCK",
                            //   "Quantity": 80,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "2/17",
                            //   "Trade Price": -41.57,
                            //   "P/L Day": -8.8,
                            //   "P/L Open": "4,579.00",
                            //   "Cost": "-3,325.80",
                            //   "Delta": 80,
                            //   "Theta": 0,
                            //   "Bid": 98.78,
                            //   "Ask": 98.84,
                            //   "PoP": "50%",
                            //   "IV Rank": 3.8,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 38.8,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "DOC",
                            //   "Type": "STOCK",
                            //   "Quantity": 200,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "3/31",
                            //   "Trade Price": -15.58,
                            //   "P/L Day": -13,
                            //   "P/L Open": 563.1,
                            //   "Cost": "-3,115.90",
                            //   "Delta": 200,
                            //   "Theta": 0,
                            //   "Bid": 18.39,
                            //   "Ask": 18.4,
                            //   "PoP": "50%",
                            //   "IV Rank": 16,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 7.85,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "ENB",
                            //   "Type": "STOCK",
                            //   "Quantity": 32,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "2/11",
                            //   "Trade Price": -28.75,
                            //   "P/L Day": -0.32,
                            //   "P/L Open": 256.32,
                            //   "Cost": -920,
                            //   "Delta": 32,
                            //   "Theta": 0,
                            //   "Bid": 36.76,
                            //   "Ask": 36.77,
                            //   "PoP": "50%",
                            //   "IV Rank": 8,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 2.54,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "EPR",
                            //   "Type": "STOCK",
                            //   "Quantity": 100,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "4/29",
                            //   "Trade Price": -26.82,
                            //   "P/L Day": 81.5,
                            //   "P/L Open": "2,209.40",
                            //   "Cost": "-2,682.10",
                            //   "Delta": 100,
                            //   "Theta": 0,
                            //   "Bid": 48.88,
                            //   "Ask": 48.96,
                            //   "PoP": "50%",
                            //   "IV Rank": 13,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 26.31,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "FRT",
                            //   "Type": "STOCK",
                            //   "Quantity": 70,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "3/15",
                            //   "Trade Price": -83.59,
                            //   "P/L Day": -39.9,
                            //   "P/L Open": "1,465.40",
                            //   "Cost": "-5,851.00",
                            //   "Delta": 70,
                            //   "Theta": 0,
                            //   "Bid": 104.43,
                            //   "Ask": 104.58,
                            //   "PoP": "50%",
                            //   "IV Rank": 11.7,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 22.08,
                            //   "Ext": 0
                            // },
                            // {
                            //   "Account": "5WV68303",
                            //   "Symbol": "GEO",
                            //   "Type": "STOCK",
                            //   "Quantity": 450,
                            //   "Exp Date": "",
                            //   "DTE": "--",
                            //   "Strike Price": "",
                            //   "Call/Put": "",
                            //   "Dividend At": "1/22",
                            //   "Trade Price": -11.71,
                            //   "P/L Day": -690.75,
                            //   "P/L Open": "-2,452.25",
                            //   "Cost": "-5,271.50",
                            //   "Delta": 450,
                            //   "Theta": 0,
                            //   "Bid": 6.26,
                            //   "Ask": 6.27,
                            //   "PoP": "50%",
                            //   "IV Rank": 26.6,
                            //   "D's Opn": "",
                            //   "Days To Expiration": "--",
                            //   "β Delta": 5.92,
                            //   "Ext": 0
                            // },
                            {
                              "Account": "5WV68303",
                              "Symbol": "GOOG",
                              "Type": "STOCK",
                              "Quantity": 1,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "",
                              "Trade Price": "-1100.00",
                              "P/L Day": 25.55,
                              "P/L Open": "1,150.30",
                              "Cost": "-1,100.00",
                              "Delta": 1,
                              "Theta": 0,
                              "Bid": "2,249.41",
                              "Ask": "2,250.61",
                              "PoP": "50%",
                              "IV Rank": 15,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 5.4,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "HT",
                              "Type": "STOCK",
                              "Quantity": 100,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/30",
                              "Trade Price": -5.95,
                              "P/L Day": -7,
                              "P/L Open": 465,
                              "Cost": -595,
                              "Delta": 100,
                              "Theta": 0,
                              "Bid": 10.6,
                              "Ask": 10.61,
                              "PoP": "50%",
                              "IV Rank": 6.7,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 8.42,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "IRT",
                              "Type": "STOCK",
                              "Quantity": 780,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/31",
                              "Trade Price": -9.99,
                              "P/L Day": -78,
                              "P/L Open": "4,226.85",
                              "Cost": "-7,792.95",
                              "Delta": 780,
                              "Theta": 0,
                              "Bid": 15.4,
                              "Ask": 15.41,
                              "PoP": "50%",
                              "IV Rank": 30.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 29.11,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "JNJ",
                              "Type": "STOCK",
                              "Quantity": 8,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "2/22",
                              "Trade Price": -127.86,
                              "P/L Day": 0.96,
                              "P/L Open": 285.2,
                              "Cost": "-1,022.88",
                              "Delta": 8,
                              "Theta": 0,
                              "Bid": 163.52,
                              "Ask": 163.53,
                              "PoP": "50%",
                              "IV Rank": 8.3,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 2.3,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "JPM",
                              "Type": "STOCK",
                              "Quantity": 40,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "4/05",
                              "Trade Price": -92.75,
                              "P/L Day": 78,
                              "P/L Open": "2,469.60",
                              "Cost": "-3,710.00",
                              "Delta": 40,
                              "Theta": 0,
                              "Bid": 154.47,
                              "Ask": 154.5,
                              "PoP": "50%",
                              "IV Rank": -0.4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 19.07,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "KMI",
                              "Type": "STOCK",
                              "Quantity": 80,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "1/29",
                              "Trade Price": -14.38,
                              "P/L Day": 16,
                              "P/L Open": 201.6,
                              "Cost": "-1,150.40",
                              "Delta": 80,
                              "Theta": 0,
                              "Bid": 16.89,
                              "Ask": 16.9,
                              "PoP": "50%",
                              "IV Rank": 6.7,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 3.87,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "KOF",
                              "Type": "STOCK",
                              "Quantity": 100,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "10/29",
                              "Trade Price": -46.78,
                              "P/L Day": -36,
                              "P/L Open": -15.97,
                              "Cost": "-4,677.97",
                              "Delta": 100,
                              "Theta": 0,
                              "Bid": 46.6,
                              "Ask": 46.65,
                              "PoP": "50%",
                              "IV Rank": 8.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 10.14,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "LADR",
                              "Type": "STOCK",
                              "Quantity": 350,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/30",
                              "Trade Price": -8.48,
                              "P/L Day": 0,
                              "P/L Open": "1,058.50",
                              "Cost": "-2,966.50",
                              "Delta": 350,
                              "Theta": 0,
                              "Bid": 11.5,
                              "Ask": 11.51,
                              "PoP": "50%",
                              "IV Rank": 5.3,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 24.29,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "LEG",
                              "Type": "STOCK",
                              "Quantity": 80,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/12",
                              "Trade Price": -24.85,
                              "P/L Day": 30.4,
                              "P/L Open": "1,749.84",
                              "Cost": "-1,987.76",
                              "Delta": 80,
                              "Theta": 0,
                              "Bid": 46.69,
                              "Ask": 46.73,
                              "PoP": "50%",
                              "IV Rank": 4.3,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 14.46,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "LTC",
                              "Type": "STOCK",
                              "Quantity": 74,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "4/21",
                              "Trade Price": -27.16,
                              "P/L Day": 2.22,
                              "P/L Open": "1,211.92",
                              "Cost": "-2,010.04",
                              "Delta": 74,
                              "Theta": 0,
                              "Bid": 43.53,
                              "Ask": 43.56,
                              "PoP": "50%",
                              "IV Rank": 1.8,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 8.16,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "MAC",
                              "Type": "STOCK",
                              "Quantity": 100,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "2/18",
                              "Trade Price": -6.08,
                              "P/L Day": 17,
                              "P/L Open": 627,
                              "Cost": -608,
                              "Delta": 100,
                              "Theta": 0,
                              "Bid": 12.34,
                              "Ask": 12.35,
                              "PoP": "50%",
                              "IV Rank": 6.2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 6.34,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "MPW",
                              "Type": "STOCK",
                              "Quantity": 350,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/17",
                              "Trade Price": -17.29,
                              "P/L Day": -50.75,
                              "P/L Open": "1,545.75",
                              "Cost": "-6,051.00",
                              "Delta": 350,
                              "Theta": 0,
                              "Bid": 21.7,
                              "Ask": 21.71,
                              "PoP": "50%",
                              "IV Rank": 4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 10.33,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "MS",
                              "Type": "STOCK",
                              "Quantity": 27,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "1/28",
                              "Trade Price": -36.89,
                              "P/L Day": -8.91,
                              "P/L Open": "1,130.49",
                              "Cost": -996.03,
                              "Delta": 27,
                              "Theta": 0,
                              "Bid": 78.75,
                              "Ask": 78.76,
                              "PoP": "50%",
                              "IV Rank": 6.2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 8.3,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "MSFT",
                              "Type": "STOCK",
                              "Quantity": 6,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "5/19",
                              "Trade Price": -167.31,
                              "P/L Day": 13.08,
                              "P/L Open": 496.38,
                              "Cost": "-1,003.86",
                              "Delta": 6,
                              "Theta": 0,
                              "Bid": 250.03,
                              "Ask": 250.04,
                              "PoP": "50%",
                              "IV Rank": 5.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 2.84,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "NNN",
                              "Type": "STOCK",
                              "Quantity": 220,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "1/28",
                              "Trade Price": -40.14,
                              "P/L Day": 57.2,
                              "P/L Open": "1,110.78",
                              "Cost": "-8,831.02",
                              "Delta": 220,
                              "Theta": 0,
                              "Bid": 45.18,
                              "Ask": 45.19,
                              "PoP": "50%",
                              "IV Rank": -0.8,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 21.98,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "NVDA",
                              "Type": "STOCK",
                              "Quantity": 4,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/09",
                              "Trade Price": -241.36,
                              "P/L Day": 55.22,
                              "P/L Open": "1,307.62",
                              "Cost": -965.44,
                              "Delta": 4,
                              "Theta": 0,
                              "Bid": 568.18,
                              "Ask": 568.3,
                              "PoP": "50%",
                              "IV Rank": 1.8,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 7.66,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "O",
                              "Type": "STOCK",
                              "Quantity": 150,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/31",
                              "Trade Price": -59.14,
                              "P/L Day": 19.5,
                              "P/L Open": 918,
                              "Cost": "-8,871.00",
                              "Delta": 150,
                              "Theta": 0,
                              "Bid": 65.25,
                              "Ask": 65.26,
                              "PoP": "50%",
                              "IV Rank": 4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 19.34,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "PFF",
                              "Type": "STOCK",
                              "Quantity": 35,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "4/01",
                              "Trade Price": -28.72,
                              "P/L Day": 1.05,
                              "P/L Open": 347.2,
                              "Cost": "-1,005.20",
                              "Delta": 35,
                              "Theta": 0,
                              "Bid": 38.63,
                              "Ask": 38.64,
                              "PoP": "50%",
                              "IV Rank": 0,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 1.56,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "RDS/B",
                              "Type": "STOCK",
                              "Quantity": 250,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "2/18",
                              "Trade Price": -31.87,
                              "P/L Day": 157.5,
                              "P/L Open": "1,568.13",
                              "Cost": "-7,966.87",
                              "Delta": 250,
                              "Theta": 0,
                              "Bid": 38.14,
                              "Ask": 38.15,
                              "PoP": "50%",
                              "IV Rank": 5.4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 25.36,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "SPG",
                              "Type": "STOCK",
                              "Quantity": 38,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "4/08",
                              "Trade Price": -87.39,
                              "P/L Day": -7.98,
                              "P/L Open": "1,097.92",
                              "Cost": "-3,320.72",
                              "Delta": 38,
                              "Theta": 0,
                              "Bid": 116.25,
                              "Ask": 116.28,
                              "PoP": "50%",
                              "IV Rank": 12.4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 19.98,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "STAG",
                              "Type": "STOCK",
                              "Quantity": 227,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/30",
                              "Trade Price": -27.83,
                              "P/L Day": -24.97,
                              "P/L Open": "1,498.80",
                              "Cost": "-6,316.81",
                              "Delta": 227,
                              "Theta": 0,
                              "Bid": 34.42,
                              "Ask": 34.43,
                              "PoP": "50%",
                              "IV Rank": 15.2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 17.32,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "STAR",
                              "Type": "STOCK",
                              "Quantity": 200,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "2/26",
                              "Trade Price": -18.44,
                              "P/L Day": 4.38,
                              "P/L Open": 4.38,
                              "Cost": "-3,687.62",
                              "Delta": 200,
                              "Theta": 0,
                              "Bid": 18.46,
                              "Ask": 18.47,
                              "PoP": "50%",
                              "IV Rank": 9.2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 7.24,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "STOR",
                              "Type": "STOCK",
                              "Quantity": 500,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/30",
                              "Trade Price": -22.41,
                              "P/L Day": -56.39,
                              "P/L Open": "5,782.51",
                              "Cost": "-11,207.49",
                              "Delta": 500,
                              "Theta": 0,
                              "Bid": 33.97,
                              "Ask": 33.98,
                              "PoP": "50%",
                              "IV Rank": 1.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 58.49,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "T",
                              "Type": "STOCK",
                              "Quantity": 36,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "4/08",
                              "Trade Price": -28.23,
                              "P/L Day": -2,
                              "P/L Open": 97,
                              "Cost": "-1,016.28",
                              "Delta": 36,
                              "Theta": 0,
                              "Bid": 30.92,
                              "Ask": 30.93,
                              "PoP": "50%",
                              "IV Rank": 0.9,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 2.12,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "TWTR",
                              "Type": "STOCK",
                              "Quantity": 10,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "",
                              "Trade Price": -26.61,
                              "P/L Day": 21.9,
                              "P/L Open": 425.8,
                              "Cost": -266.1,
                              "Delta": 10,
                              "Theta": 0,
                              "Bid": 69.18,
                              "Ask": 69.2,
                              "PoP": "50%",
                              "IV Rank": 14.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 1.63,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "UBA",
                              "Type": "STOCK",
                              "Quantity": 100,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/31",
                              "Trade Price": -14.49,
                              "P/L Day": 6,
                              "P/L Open": 282.6,
                              "Cost": "-1,449.40",
                              "Delta": 100,
                              "Theta": 0,
                              "Bid": 17.3,
                              "Ask": 17.35,
                              "PoP": "50%",
                              "IV Rank": 5.8,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 4.49,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "UMH",
                              "Type": "STOCK",
                              "Quantity": 500,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "5/14",
                              "Trade Price": -11.67,
                              "P/L Day": 85,
                              "P/L Open": "3,911.67",
                              "Cost": "-5,833.33",
                              "Delta": 500,
                              "Theta": 0,
                              "Bid": 19.48,
                              "Ask": 19.5,
                              "PoP": "50%",
                              "IV Rank": 12.8,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 27.03,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "VICI",
                              "Type": "STOCK",
                              "Quantity": 400,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/24",
                              "Trade Price": -20.98,
                              "P/L Day": -43.75,
                              "P/L Open": "3,200.05",
                              "Cost": "-8,393.95",
                              "Delta": 400,
                              "Theta": 0,
                              "Bid": 28.98,
                              "Ask": 28.99,
                              "PoP": "50%",
                              "IV Rank": 2.9,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 29.53,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "VNQI",
                              "Type": "STOCK",
                              "Quantity": 26,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "12/18",
                              "Trade Price": -39.72,
                              "P/L Day": 7.68,
                              "P/L Open": 437.2,
                              "Cost": "-1,032.72",
                              "Delta": 26,
                              "Theta": 0,
                              "Bid": 56.53,
                              "Ask": 56.56,
                              "PoP": "50%",
                              "IV Rank": 17.6,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 2.98,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "VOO",
                              "Type": "STOCK",
                              "Quantity": 4,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/26",
                              "Trade Price": -230.13,
                              "P/L Day": 1.26,
                              "P/L Open": 573.78,
                              "Cost": -920.52,
                              "Delta": 4,
                              "Theta": 0,
                              "Bid": 373.56,
                              "Ask": 373.58,
                              "PoP": "50%",
                              "IV Rank": 2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 3.69,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "VST",
                              "Type": "STOCK",
                              "Quantity": 300,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/16",
                              "Trade Price": -17.71,
                              "P/L Day": -48.03,
                              "P/L Open": 3.48,
                              "Cost": "-5,312.49",
                              "Delta": 300,
                              "Theta": 0,
                              "Bid": 17.71,
                              "Ask": 17.72,
                              "PoP": "50%",
                              "IV Rank": 23.4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 11.55,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "WFC",
                              "Type": "STOCK",
                              "Quantity": 400,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "2/04",
                              "Trade Price": -25.39,
                              "P/L Day": -10,
                              "P/L Open": "5,773.24",
                              "Cost": "-10,156.76",
                              "Delta": 400,
                              "Theta": 0,
                              "Bid": 39.82,
                              "Ask": 39.83,
                              "PoP": "50%",
                              "IV Rank": 1.4,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 49.59,
                              "Ext": 0
                            },
                            {
                              "Account": "5WV68303",
                              "Symbol": "WPC",
                              "Type": "STOCK",
                              "Quantity": 50,
                              "Exp Date": "",
                              "DTE": "--",
                              "Strike Price": "",
                              "Call/Put": "",
                              "Dividend At": "3/30",
                              "Trade Price": -55.27,
                              "P/L Day": -84.5,
                              "P/L Open": 773.95,
                              "Cost": "-2,763.55",
                              "Delta": 50,
                              "Theta": 0,
                              "Bid": 70.71,
                              "Ask": 70.74,
                              "PoP": "50%",
                              "IV Rank": 3.2,
                              "D's Opn": "",
                              "Days To Expiration": "--",
                              "β Delta": 6.58,
                              "Ext": 0
                            }
                          ]


                        for (const holding of holdings) {
                            await API.graphql(graphqlOperation(createHolding, {
                                input: {
                                    price: String(holding['Trade Price']).split('-')[1],
                                    comments: 'Imported',
                                    quantity: holding.Quantity,
                                    owner: attributes.sub,
                                    symbol: holding.Symbol
                                }
                            }));
                        }

                        // await API.graphql(graphqlOperation(createHolding, {
                        //     input: {
                        //         price: values.price,
                        //         comments: values.comments,
                        //         quantity: values.quantity,
                        //         owner: attributes.sub,
                        //         symbol: String(values.symbol).toUpperCase(),
                        //     }
                        // }));
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
