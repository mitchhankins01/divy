import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
  makeStyles,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import { Save as SaveIcon } from '@material-ui/icons';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  textField: {
    marginBottom: theme.spacing(2)
  }
}));

export default ({ className, ...rest }) => {
  const classes = useStyles();
  const { attributes, updateName } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid className={clsx(classes.root, className)} item lg={6} xs={12} {...rest}>
      <Formik
        initialValues={{
          firstName: attributes.given_name,
          lastName: attributes.family_name
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First name is required'),
          lastName: Yup.string().max(255).required('Last name is required'),
        })}
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            await updateName(values.firstName, values.lastName);
            setSubmitting(false);
            setStatus({ success: true });
            enqueueSnackbar('Changes Saved', { variant: 'success' });
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
          <Card
            className={clsx(classes.root, className)}
            {...rest}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                textAlign="center"
                mb={2}
              >
                <Avatar
                  className={classes.avatar}
                // src={user.avatar}
                />
                <Typography
                  className={classes.name}
                  color="textPrimary"
                  gutterBottom
                  variant="h3"
                >
                  {`${attributes.given_name} ${attributes.family_name}`}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body1"
                >
                  Your tier:
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/pricing"
                  >
                    {/* {attributes.tier} */}
                    Update this
                  </Link>
                </Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  autoComplete='off'
                  label="First Name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  value={values.firstName}
                  variant="outlined"
                  className={classes.textField}
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  value={values.lastName}
                  variant="outlined"
                  className={classes.textField}
                />
                <Typography color='error'>
                  {errors.submit}
                </Typography>
                <Box mt={2} className={classes.buttonsBar}>
                  <Button
                    variant='contained'
                    color='secondary'
                    fullWidth
                    type='submit'
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        )}
      </Formik>
    </Grid>
  );
};