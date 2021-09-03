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
};

const AuthContext = createContext({
  ...initialAuthState,
  login: () => Promise.resolve(),
  logout: () => { },
  register: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  forgotPasswordSubmit: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialAuthState);

  const login = async (email, password) => {
    await Auth.signIn({ username: email, password });
    setState({ ...initialAuthState, isAuthenticated: true, isInitialized: true });
  };

  const forgotPassword = async (email) => {
    await Auth.forgotPassword(email);
  }

  const forgotPasswordSubmit = async (email, code, newPassword) => {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  }

  const logout = () => {
    Cache.clear();
    Auth.signOut();
    setState({ ...initialAuthState, isAuthenticated: false, isInitialized: true });
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

  useEffect(() => {
    console.log('init');
    const intialize = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          setState({ ...initialAuthState, isAuthenticated: true, isInitialized: true });
        } else {
          setState({ ...initialAuthState, isAuthenticated: false, isInitialized: true });
        }
      } catch (err) {
        console.log('session expired clearing cache');
        Cache.clear();
        setState({ ...initialAuthState, isAuthenticated: false, isInitialized: true });
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
        forgotPassword,
        forgotPasswordSubmit
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;