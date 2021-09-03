import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import {
  StylesProvider,
  ThemeProvider,
  CssBaseline
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Hub } from 'aws-amplify';
import GlobalStyles from 'src/components/GlobalStyles';
import ScrollReset from 'src/components/ScrollReset';
import CookiesNotification from 'src/components/CookiesNotification';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import SettingsNotification from 'src/components/SettingsNotification';
import { AuthProvider } from 'src/contexts/AuthContext';
import { DataProvider } from 'src/contexts/DataContext';
import useSettings from 'src/hooks/useSettings';
import { createTheme } from 'src/theme';
import routes, { renderRoutes } from 'src/routes';

const history = createBrowserHistory();

Hub.listen('auth', (data) => {
  switch (data.payload.event) {
    case 'signIn':
      history.push('/app');
      console.log('user signed in');
      break;
    // case 'signUp':
    //   logger.info('user signed up');
    //   break;
    case 'signOut':
      console.info('user signed out');
      history.push('/')
      break;
    // case 'signIn_failure':
    //   logger.error('user sign in failed');
    //   break;
    // case 'tokenRefresh':
    //   logger.info('token refresh succeeded');
    //   break;
    // case 'tokenRefresh_failure':
    //   logger.error('token refresh failed');
    //   break;
    // case 'configured':
    //   logger.info('the Auth module is configured');
    default:
      break;
  }
});

const App = () => {
  const { settings } = useSettings();

  const theme = createTheme({
    theme: settings.theme,
    responsiveFontSizes: settings.responsiveFontSizes,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StylesProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router history={history}>
            <SnackbarProvider
              dense
              maxSnack={3}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom'
              }}
            >
              <AuthProvider>
                <DataProvider>
                  <GlobalStyles />
                  <ScrollReset />
                  <GoogleAnalytics />
                  <CookiesNotification />
                  <SettingsNotification />
                  {renderRoutes(routes)}
                </DataProvider>
              </AuthProvider>
            </SnackbarProvider>
          </Router>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
