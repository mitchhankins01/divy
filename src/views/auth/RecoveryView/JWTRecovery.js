import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles,
  Typography
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ForgotPasswordSubmit = ({ className, ...rest }) => {
  const classes = useStyles();
  const { forgotPasswordSubmit } = useAuth();
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        code: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        code: Yup.string().min(1).max(10).required('Verification code is required'),
        password: Yup.string().min(7).max(255).required('Password is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await forgotPasswordSubmit(rest.email, values.code, values.password);

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
                variant="body"
                color="textPrimary"
              >
                Password change successful.
              </Typography>
            ) : (
              <form
                noValidate
                className={clsx(classes.root, className)}
                onSubmit={handleSubmit}
                {...rest}
              >
                <TextField
                  error={Boolean(touched.code && errors.code)}
                  fullWidth
                  helperText={touched.code && errors.code}
                  label="Verification Code"
                  margin="normal"
                  name="code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.code}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="New Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
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
                    Change Password
            </Button>
                </Box>
              </form>
            )}
        </>
      )}
    </Formik>
  );
};

const ForgotPassword = ({ className, ...rest }) => {
  const classes = useStyles();
  const { forgotPassword } = useAuth();
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        email: 'mitchhankins@icloud.com',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await forgotPassword(values.email);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
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
          {status && status.success ? (
            <ForgotPasswordSubmit email={values.email} />
          ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className={clsx(classes.root, className)}
                {...rest}
              >
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  autoFocus
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
                    Send Reset Code
            </Button>
                </Box>
              </form>
            )}
        </>
      )
      }
    </Formik >
  );
};

export default ForgotPassword;
