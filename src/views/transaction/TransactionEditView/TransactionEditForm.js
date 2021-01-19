import React from 'react';
import PropTypes from 'prop-types';
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
    Switch,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'; import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import wait from 'src/utils/wait';

const useStyles = makeStyles(() => ({
    root: {}
}));

const TransactionEditForm = ({
    className,
    ...rest
}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const customer = {};
    const transaction = {};

    return (
        <Formik
            initialValues={{
                price: transaction.price || '',
                numberOfShares: transaction.numberOfShares || '',
                hasDiscountedPrices: customer.hasDiscountedPrices || false,
                symbol: transaction.symbol || '',
                date: transaction.date || new Date(),
                submit: null
            }}
            validationSchema={Yup.object().shape({
                price: Yup.number().required('Price per share is required'),
                numberOfShares: Yup.number().required('Number of shares are required'),
                symbol: Yup.string().max(255).required('Symbol is required'),
                date: Yup.date().required('Date is required')
            })}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    // NOTE: Make API request
                    await wait(500);
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    enqueueSnackbar('Customer updated', {
                        variant: 'success',
                        action: <Button>See all</Button>
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
                                        value={values.symbol}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.numberOfShares && errors.numberOfShares)}
                                        fullWidth
                                        helperText={touched.numberOfShares && errors.numberOfShares}
                                        label="Number of Shares"
                                        name="numberOfShares"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.numberOfShares}
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
                            </Grid>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Add Transaction
                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

TransactionEditForm.propTypes = {
    className: PropTypes.string,
};

export default TransactionEditForm;
