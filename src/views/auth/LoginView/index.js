import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import JWTLogin from './JWTLogin';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  cardContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Login" >
      <Container className={classes.cardContainer} maxWidth="sm" >
        <Box mb={2} display="flex" justifyContent="center" >
          <RouterLink style={{ textDecoration: 'none' }} to="/">
            <Logo rem={1.5} forceDark={true} />
          </RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box alignItems="center" display="flex" justifyContent="space-between" mb={3} >
              <div>
                <Typography color="textPrimary" gutterBottom variant="h2">
                  Welcome Back
                </Typography>
              </div>
            </Box>
            <Box flexGrow={1}>
              <JWTLogin />
            </Box>
            <Box my={3}>
              <Divider />
            </Box>
            <Box alignItems="center" display="flex" justifyContent="space-between" mb={3} >
              <Link component={RouterLink} to="/recovery" variant="body2" color="textSecondary" >
                Forgot your password?
              </Link>
              <Link component={RouterLink} to="/register" variant="body2" color="textSecondary" >
                Create an account.
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};
