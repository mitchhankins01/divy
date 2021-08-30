import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { Auth, Cache, API, graphqlOperation } from 'aws-amplify';
import { listStatistics } from 'src/graphql/queries';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const initialAuthState = {
  isAuthenticated: false,
  listStatistics: {
    data: [],
    costBasis: 0,
    marketValue: 0,
    totalDividends: 0
  }
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
  const isMountedRef = useIsMountedRef();
  const [state, setState] = useState(initialAuthState);
  const { isAuthenticated } = state;

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

  const getStatistics = useCallback(async () => {
    const processStatistics = list => {
      console.log('processing statistics');
      let costBasis = 0;
      let marketValue = 0;
      let totalDividends = 0;

      list.forEach(holding => {
        costBasis += holding.costBasis;
        marketValue += holding.marketValue;
        totalDividends += holding.totalDividends;
      });

      setState(s => ({ ...s, listStatistics: { data: list, costBasis, marketValue, totalDividends } }));
    }

    if (isMountedRef.current) {
      const cachedListStatistics = Cache.getItem('listStatistics');

      if (cachedListStatistics) {
        console.log('listStatistics already cached');
        processStatistics(cachedListStatistics);
      } else {
        console.log('caching listStatistics');

        const { data: listStatisticsData } = await API.graphql(graphqlOperation(listStatistics));
        const parsedListStatisticsData = JSON.parse(listStatisticsData.listStatistics);
        Cache.setItem(
          'listStatistics',
          parsedListStatisticsData,
          { expires: new Date().setHours(new Date().getHours() + 1) }
        );
        processStatistics(parsedListStatisticsData);
      }
    }
  }, [isMountedRef]);

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

  useEffect(() => {
    console.log('isAuthenticated effect auth: ', isAuthenticated);
    if (isAuthenticated) {
      console.log('auth yes, getStatistics');
      getStatistics();
    }
  }, [isAuthenticated, getStatistics]);

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