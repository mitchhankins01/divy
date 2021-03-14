import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    makeStyles,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    IconButton
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'; import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import wait from 'src/utils/wait';
import { buyColor, sellColor } from '../../../theme';

const useStyles = makeStyles(() => ({
    root: {},
    buyRadio: {
        '&.Mui-checked': {
            color: buyColor
        }
    },
    sellRadio: {
        '&.Mui-checked': {
            color: sellColor
        }
    },
    buttonsBar: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

const TransactionEditForm = ({
    className,
    ...rest
}) => {
    const history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();


    let transaction;
    if (history.location.state) {
        transaction = { ...history.location.state };
    } else {
        transaction = {};
    }
    console.log(transaction.date)
    console.log(new Date(transaction.date))

    const handleDeleteClick = async () => {
        const res = await API.del('transactionsApi', '/transactions', { body: { id: transaction.id, } });
        enqueueSnackbar('Transaction Deleted', { variant: 'success' });
        history.push('/app/transactions');
    }
    
    return (
        <Formik
            initialValues={{
                price: transaction.price || '',
                quantity: transaction.quantity || '',
                symbol: transaction.symbol || '',
                date: transaction.date || new Date(),
                side: transaction.side || 'BUY',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                price: Yup.number().required('Price per share is required'),
                quantity: Yup.number().required('Number of shares are required'),
                symbol: Yup.string().max(255).required('Symbol is required'),
                date: Yup.date().required('Date is required'),
            })}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    if (transaction.id) {
                        await API.put('transactionsApi', '/transactions', {
                            body: {
                                id: transaction.id,
                                price: values.price,
                                symbol: values.symbol,
                                side: values.side,
                                quantity: values.quantity,
                                date: values.date,
                            }
                        });
                    } else {
                        await API.post('transactionsApi', '/transactions', {
                            body: {
                                price: values.price,
                                symbol: values.symbol,
                                side: values.side,
                                quantity: values.quantity,
                                date: values.date,
                            }
                        });
                    }
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    history.push('/app/transactions');
                    enqueueSnackbar(transaction.id ? 'Transaction Updated' : 'Transaction Added', {
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
                                        label="Symbol"
                                        name="symbol"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.symbol.toUpperCase()}
                                        variant="outlined"
                                    />
                                </Grid>
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
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            // disableToolbar
                                            inputVariant="outlined"
                                            format="MM/dd/yyyy"
                                            label="Transaction Date"
                                            error={Boolean(touched.date && errors.date)}
                                            fullWidth
                                            helperText={touched.date && errors.date}
                                            name="date"
                                            onBlur={handleBlur}
                                            onChange={value => setFieldValue('date', value)}
                                            value={values.date}
                                            required
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <FormControl
                                        component="fieldset"
                                        error={Boolean(touched.side && errors.side)}
                                    >
                                        <FormLabel component="legend">Side</FormLabel>
                                        <RadioGroup row={true} name="side" value={values.side} onChange={handleChange} onBlur={handleBlur}>
                                            <FormControlLabel value="BUY" control={<Radio className={classes.buyRadio} />} label="Buy" />
                                            <FormControlLabel value="SELL" control={<Radio className={classes.sellRadio} />} label="Sell" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box mt={2} className={classes.buttonsBar}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {transaction.id ? 'Update Transaction' : 'Add Transaction'}
                                </Button>
                                <IconButton onClick={handleDeleteClick}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default TransactionEditForm;
