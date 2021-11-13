import React from 'react';
import {
  Box,
  Card,
  Grid,
  makeStyles,
  Button,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Delete as DeleteIcon, Save as SaveIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Header from './Header';
import useData from 'src/hooks/useData';
import Page from 'src/components/Page';
import { deletePortfolio, createPortfolio, updatePortfolio } from 'src/graphql/mutations';

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
  const { refetchPortfolios, loading, portfolios } = useData();

  let portfolio;
  if (history.location.state) {
    portfolio = { ...history.location.state };
  } else {
    portfolio = {};
  }

  const handleDeleteClick = async () => {
    const answer = window.confirm(`Are you sure you want to delete ${portfolio.name}? This action cannot be undone.`);
    if (answer) {
      await API.graphql(graphqlOperation(deletePortfolio, { input: { id: portfolio.id } }));
      refetchPortfolios();
      enqueueSnackbar('Portfolio Deleted', { variant: 'success' });
      history.push('/app/portfolios');
    }
  }

  return (
    <Page className={classes.root} title={portfolio.id ? `Edit ${portfolio.name}` : 'New Portfolio'}>
      <Header portfolio={portfolio} />
      <Grid item lg={6} xs={12}>
        <Box mt={2}>
          <Card>
            <Formik
              initialValues={{
                name: portfolio.name || '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().max(15).required('Name is required'),
              })}
              onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
              }) => {
                try {
                  if (portfolio.id) {
                    const portfolioExists = portfolios.some(({ name }) => name.toLowerCase() === values.name.toLowerCase());
                    if (portfolioExists) {
                        return setErrors({ submit: `You already have a portfolio named ${values.name}.` });
                    }

                    await API.graphql(graphqlOperation(updatePortfolio, {
                      input:
                      {
                        id: portfolio.id,
                        name: values.name,
                      }
                    }));
                    refetchPortfolios();
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    history.push('/app/portfolios');
                    enqueueSnackbar('Portfolio Updated', { variant: 'success' });
                  } else {
                    const portfolioExists = portfolios.some(({ name }) => name.toLowerCase() === values.name.toLowerCase());

                    if (portfolioExists) {
                      setErrors({ submit: `You already have a portfolio named ${values.name}.` });
                    } else if (portfolios.length >= 5) {
                      setErrors({ submit: 'You can only have 5 portfolios.' });
                    } else {
                      const { attributes } = await Auth.currentAuthenticatedUser();
                      await API.graphql(graphqlOperation(createPortfolio, {
                        input: {
                          name: values.name,
                          owner: attributes.sub,
                        }
                      }));
                      refetchPortfolios();
                      resetForm();
                      setStatus({ success: true });
                      setSubmitting(false);
                      history.push('/app/portfolios');
                      enqueueSnackbar('Portfolio Added', { variant: 'success' });
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
              }) => (
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label='Name'
                      name='name'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={String(values.name).replace('^', '')}
                      variant='outlined'
                      autoCapitalize='on'
                      className={classes.textField}
                    />
                    <Typography color='error'>
                      {errors.submit}
                    </Typography>
                    <Box mt={2} className={classes.buttonsBar}>
                      {portfolio.id && (
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={handleDeleteClick}
                          variant="outlined"
                          disabled={isSubmitting || loading}
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
                        disabled={isSubmitting || loading}
                      >
                        {portfolio.id ? 'Update Portfolio' : 'Add Portfolio'}
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
