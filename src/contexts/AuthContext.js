import React, {
  createContext,
  useState,
  useEffect,
} from 'react';
import { Auth, Cache } from 'aws-amplify';
import SplashScreen from 'src/components/SplashScreen';

const initialAuthState = {
  isInitialized: false,
  isAuthenticated: false,
  attributes: {
    given_name: '',
    family_name: '',
    'custom:subscription': '',
    'custom:stripe_customer_id': ''
  },
  SUBSCRIPTIONS: {
    'price_1JWjYyFRojIX8Uh4Q3W5QFi0': 'Monthly',
    'price_1JWjZWFRojIX8Uh4yNsQ4cOp': 'Yearly'
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  login: () => Promise.resolve(),
  logout: () => { },
  updateName: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  register: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  forgotPasswordSubmit: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialAuthState);

  const setUserState = user => {
    console.log(user);
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
        forgotPassword,
        forgotPasswordSubmit
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;