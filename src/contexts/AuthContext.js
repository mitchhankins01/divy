import React, {
  createContext,
  useState,
  useEffect,
} from 'react';
import { Auth, Cache } from 'aws-amplify';
import { ChatWidget } from '@papercups-io/chat-widget';
import { useTheme } from '@material-ui/core';
import SplashScreen from 'src/components/SplashScreen';

const initialAuthState = {
  isInitialized: false,
  isAuthenticated: false,
  attributes: {
    sub: '',
    email: '',
    given_name: '',
    family_name: '',
    'custom:subscription': '',
    'custom:expires': '',
    'custom:stripe_customer_id': ''
  },
  SUBSCRIPTIONS: {
    'price_1Jj45gFRojIX8Uh49dyp76XT': 'Monthly',
    'price_1Jj46BFRojIX8Uh41J3eyCld': 'Yearly'
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  login: () => Promise.resolve(),
  logout: () => { },
  updateName: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  updateUserAttributes: () => Promise.resolve(),
  register: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  forgotPasswordSubmit: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const theme = useTheme();
  const [state, setState] = useState(initialAuthState);

  const setUserState = user => {
    setState({ ...initialAuthState, attributes: user.attributes, isAuthenticated: true, isInitialized: true });
  }

  const setInitialState = () => {
    Cache.clear();
    setState({ ...initialAuthState, isInitialized: true });
  }

  const login = async (email, password) => {
    const user = await Auth.signIn({ username: email, password });
    setUserState(user);
  };

  const forgotPassword = async (email) => {
    await Auth.forgotPassword(email);
  }

  const forgotPasswordSubmit = async (email, code, newPassword) => {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  }

  const logout = () => {
    Auth.signOut();
    setInitialState();
  };

  const register = async (email, name, password) => {
    await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        name: name
      }
    });
  };

  const updateName = async (firstName, lastName) => {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      'given_name': firstName,
      'family_name': lastName,
    });
    const updatedUser = await Auth.currentAuthenticatedUser();
    setUserState(updatedUser);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.changePassword(user, currentPassword, newPassword);
  };

  const updateUserAttributes = async () => {
    const currentUserInfo = await Auth.currentUserInfo();
    setState({ ...state, attributes: currentUserInfo.attributes });
  }

  useEffect(() => {
    console.log('init');
    const intialize = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          setUserState(user);
        } else {
          setInitialState();
        }
      } catch (err) {
        console.log('session expired clearing cache');
        setInitialState();
      }
    };
    intialize();
  }, []);

  if (!state.isInitialized) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateName,
        updatePassword,
        updateUserAttributes,
        forgotPassword,
        forgotPasswordSubmit
      }}
    >
      <>
        {children}
        <ChatWidget
          token={process.env.REACT_APP_PAPERCUPS_TOKEN}
          // token="da152080-edbd-4a60-8d07-7ad2c61738ab"
          title="Welcome to Divy"
          subtitle="Ask us anything in the chat window below 😊"
          primaryColor={theme.palette.primary.main}
          newMessagePlaceholder="Start typing..."
          showAgentAvailability={false}
          agentAvailableText="We're online right now!"
          agentUnavailableText="We're away at the moment."
          requireEmailUpfront={false}
          iconVariant="outlined"
          baseUrl="https://app.papercups.io"
          customer={{
            name: `${state.attributes.given_name} ${state.attributes.family_name}`,
            email: state.attributes.email,
            metadata: {
              sub: state.attributes.sub,
              plan: state.attributes['custom:subscription'],
              stripe_id: state.attributes['custom:stripe_customer_id'],
              stripe_expires: state.attributes['custom:expires']
            }
          }}
        />
      </>
    </AuthContext.Provider>
  );
};

export default AuthContext;