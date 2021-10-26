import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  makeStyles,
  Button,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useDebounce } from 'use-debounce';
import { Delete as DeleteIcon, Save as SaveIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Header from './Header';
import useData from 'src/hooks/useData';
import Page from 'src/components/Page';
import { querySymbol } from 'src/graphql/queries';
import { createHolding, updateHolding, deleteHolding } from 'src/graphql/mutations';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    }
  },
  buttonsBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textField: {
    marginBottom: theme.spacing(2),
  }
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { processRefetch, listStatistics } = useData();
  const [autoCompleteSearch, setAutoCompleteSearch] = useState('');
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
  const [debouncedAutoCompleteSearch] = useDebounce(autoCompleteSearch, 1000);

  useEffect(() => {
    if (debouncedAutoCompleteSearch) {
      setAutoCompleteLoading(true);

      (async () => {
        const { data } = await API.graphql(graphqlOperation(querySymbol, { symbol: debouncedAutoCompleteSearch }));
        setAutoCompleteResults(data.querySymbol);
        setAutoCompleteLoading(false);
      })();

    }
  }, [debouncedAutoCompleteSearch]);


  let holding;
  if (history.location.state) {
    holding = { ...history.location.state };
  } else {
    holding = {};
  }

  const handleDeleteClick = async () => {
    const answer = window.confirm(`Are you sure you want to delete ${holding.symbol}? This action cannot be undone.`);
    if (answer) {
      await API.graphql(graphqlOperation(deleteHolding, { input: { id: holding.holdingID } }));
      processRefetch();
      enqueueSnackbar('Holding Deleted', { variant: 'success' });
      history.push('/app/holdings');
    }
  }

  return (
    <Page className={classes.root} title={holding.holdingID ? `Edit ${holding.symbol}` : 'New Holding'}>
      <Header holding={holding} />
      <Grid item lg={6} xs={12}>
        <Box mt={2}>
          <Card>
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
                  if (holding.holdingID) {
                    await API.graphql(graphqlOperation(updateHolding, {
                      input:
                      {
                        id: holding.holdingID,
                        price: parseFloat(values.price),
                        comments: values.comments,
                        quantity: values.quantity,
                        symbol: String(values.symbol).toUpperCase().replace(/[\W_]+/g, '-'),
                      }
                    }));
                    processRefetch();
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    history.push('/app/holdings');
                    enqueueSnackbar('Holding Updated', { variant: 'success' });
                  } else {
                    const formattedSymbol = String(values.symbol).toUpperCase().replace(/[\W_]+/g, '-');
                    console.log('listStatistics', listStatistics)
                    const symbolExists = listStatistics.data.some(({ symbol }) => symbol === formattedSymbol);

                    if (symbolExists) {
                      setErrors({ submit: 'Symbol already exists in portfolio.' });
                    } else {
                      const { attributes } = await Auth.currentAuthenticatedUser();
                      await API.graphql(graphqlOperation(createHolding, {
                        input: {
                          price: parseFloat(values.price),
                          comments: values.comments,
                          quantity: values.quantity,
                          owner: attributes.sub,
                          symbol: formattedSymbol,
                        }
                      }));
                      processRefetch();
                      resetForm();
                      setStatus({ success: true });
                      setSubmitting(false);
                      history.push('/app/holdings');
                      enqueueSnackbar('Holding Added', { variant: 'success' });
                    }
                  }
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.message || 'Something went wrong, please try again.' });
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
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    {holding.holdingID ? (
                      <TextField
                        fullWidth
                        disabled
                        label="Symbol"
                        name="symbol"
                        value={values.symbol}
                        variant="outlined"
                        className={classes.textField}
                      />
                    ) : (
                      <Autocomplete
                        loading={autoCompleteLoading}
                        noOptionsText='Begin typing for a list of results'
                        loadingText={<CircularProgress size={25} />}
                        options={autoCompleteLoading ? [] : autoCompleteResults}
                        filterOptions={(x) => x}
                        getOptionLabel={(option) => `${option.symbol} - ${option.shortname} | ${option.quoteType} - ${option.exchange}`}
                        className={classes.textField}
                        onChange={(e, value) => setFieldValue('symbol', value?.symbol || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.symbol && errors.symbol)}
                            fullWidth
                            helperText={touched.symbol && errors.symbol}
                            label="Search by Company Name or Symbol"
                            name="symbol"
                            required
                            variant="outlined"
                            onChange={event => {
                              setAutoCompleteLoading(true);
                              setAutoCompleteSearch(event.target.value);
                            }}
                          />
                        )}
                      />
                    )}
                    <TextField
                      error={Boolean(touched.quantity && errors.quantity)}
                      fullWidth
                      helperText={touched.quantity && errors.quantity}
                      label="Number of Shares"
                      name="quantity"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.quantity}
                      variant="outlined"
                      type='number'
                      className={classes.textField}
                    />
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
                      // type='number'
                      required
                      className={classes.textField}
                    />
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
                      className={classes.textField}
                    />
                    <Typography color='error'>
                      {errors.submit}
                    </Typography>
                    <Box mt={2} className={classes.buttonsBar}>
                      {holding.holdingID && (
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={handleDeleteClick}
                          variant="outlined"
                          disabled={isSubmitting}
                          style={{ marginRight: 'auto' }}
                        >
                          Delete
                        </Button>
                      )}
                      <Button
                        variant='contained'
                        color='secondary'
                        type='submit'
                        startIcon={<SaveIcon />}
                        disabled={isSubmitting}
                      >
                        {holding.holdingID ? 'Update Holding' : 'Add Holding'}
                      </Button>
                    </Box>
                  </CardContent>
                </form>
              )}
            </Formik>
          </Card>
        </Box>
      </Grid>
    </Page>
  );
};
