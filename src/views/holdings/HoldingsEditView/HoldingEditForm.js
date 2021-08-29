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
