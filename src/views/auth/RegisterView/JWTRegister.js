import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  TextField,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));

const JWTRegister = ({ className, ...rest }) => {
  const classes = useStyles();
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        email: '',
        given_name: '',
        family_name: '',
        password: '',
        policy: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        given_name: Yup.string().max(255).required('First name is required'),
        family_name: Yup.string().max(255).required('Last name is required'),
        password: Yup.string().min(7).max(255).required('Password is required'),
        policy: Yup.boolean().oneOf([true], 'This field must be checked')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await register(values.email, values.password, values.given_name, values.family_name);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
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
        status
      }) => (
        <>
          {status && status.success ?
            (
              <Typography
                variant="h4"
                color="textPrimary"
              >
                Please verify your email by clicking on the link that was sent to your inbox.
              </Typography>
            ) : (
              <form
                noValidate
                className={clsx(classes.root, className)}
                onSubmit={handleSubmit}
                {...rest}
              >
                <TextField
                  error={Boolean(touched.given_name && errors.given_name)}
                  fullWidth
                  helperText={touched.given_name && errors.given_name}
                  label="First Name"
                  margin="normal"
                  name="given_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.given_name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.family_name && errors.family_name)}
                  fullWidth
                  helperText={touched.family_name && errors.family_name}
                  label="Last Name"
                  margin="normal"
                  name="family_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.family_name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box
                  alignItems="center"
                  display="flex"
                  mt={2}
                  ml={-1}
                >
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    I have read the
              {' '}
                    <Link
                      component="a"
                      href="#"
                      color="secondary"
                    >
                      Terms and Conditions
              </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
                <Box mt={2}>
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Register
            </Button>
                </Box>
              </form>
            )}
        </>
      )}
    </Formik>
  );
};

export default JWTRegister;
