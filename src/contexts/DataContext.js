import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from 'react';
import { Cache, API, graphqlOperation } from 'aws-amplify';
import { listStatistics, listDividends, listHoldings } from 'src/graphql/queries';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';

const initialDataState = {
    listStatistics: {
        data: [],
        costBasis: 0,
        marketValue: 0,
        totalDividends: 0
    },
    listDividends: {
        all: [],
        upcoming: []
    },
    listHoldings: [],
};

const DataContext = createContext(initialDataState);

export const DataProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const isMountedRef = useIsMountedRef();
    const [state, setState] = useState(initialDataState);

    /*
      Data
    */
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

    const getDividends = useCallback(async () => {
        const processDividends = list => {
            console.log('processing dividends');

            const upcoming = [];
            const yesterday = new Date().setDate(new Date().getDate() - 1);
            list.forEach(item => {
                if (new Date(item.paymentDate) > yesterday) {
                    upcoming.push(item);
                }
            });

            setState(s => ({ ...s, listDividends: { all: list, upcoming } }));
        }

        if (isMountedRef.current) {
            const cachedListDividends = Cache.getItem('listDividends');

            if (cachedListDividends) {
                console.log('listDividends already cached');
                processDividends(cachedListDividends);
            } else {
                console.log('caching listDividends');

                const { data } = await API.graphql(graphqlOperation(listDividends));
                const parsed = JSON.parse(data.listDividends);
                Cache.setItem(
                    'listDividends',
                    parsed,
                    { expires: new Date().setHours(new Date().getHours() + 1) }
                );
                processDividends(parsed);
            }
        }
    }, [isMountedRef]);

    const getHoldings = useCallback(async () => {
        if (isMountedRef.current) {
            const cachedListHoldings = Cache.getItem('listHoldings');

            if (cachedListHoldings) {
                console.log('listHoldings already cached');
                setState(s => ({ ...s, listHoldings: cachedListHoldings }));
            } else {
                console.log('caching listHoldings');

                const { data } = await API.graphql(graphqlOperation(listHoldings));
                Cache.setItem(
                    'listHoldings',
                    data?.listHoldings?.items,
                    { expires: new Date().setHours(new Date().getHours() + 1) }
                );
                setState(s => ({ ...s, listHoldings: data?.listHoldings?.items }));
            }
        }
    }, [isMountedRef]);

    useEffect(() => {
        console.log('isAuthenticated effect auth: ', isAuthenticated);
        if (isAuthenticated) {
            console.log('auth yes, getStatistics - getDividends - getHoldings');
            getStatistics();
            getDividends();
            getHoldings();
        }
    }, [isAuthenticated, getStatistics, getDividends, getHoldings]);

    return (
        <DataContext.Provider value={state}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;