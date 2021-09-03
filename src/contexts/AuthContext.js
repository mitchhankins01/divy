import React, {
  createContext,
  useState,
  useEffect,
} from 'react';
import { Auth, Cache } from 'aws-amplify';

const initialAuthState = {
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
    setState({ ...initialAuthState, isAuthenticated: true });
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
    setState({ ...initialAuthState, isAuthenticated: false });
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
          setState({ ...initialAuthState, isAuthenticated: true });
        } else {
        }
      } catch (err) {
        console.log('session expired clearing cache');
        Cache.clear();
        setState({ ...initialAuthState, isAuthenticated: false });
      }
    };
    intialize();
  }, []);

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