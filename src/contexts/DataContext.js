import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from 'react';
import { Cache, API, graphqlOperation } from 'aws-amplify';
import { listStatistics, listDividends } from 'src/graphql/queries';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';

const disableCache = false;

const initialDataState = {
    listStatistics: {
        data: [],
        sortedData: [],
        costBasis: 0,
        marketValue: 0,
        totalDividends: 0
    },
    listDividends: {
        all: [],
        upcoming: []
    },
};

const DataContext = createContext({
    ...initialDataState,
    processRefetch: () => { }
});

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

            const _sortedData = [...list].sort((a,b) => (a.totalDividends < b.totalDividends) ? 1 : ((b.totalDividends < a.totalDividends) ? -1 : 0))

            setState(s => ({ ...s, listStatistics: { data: list, sortedData: _sortedData, costBasis, marketValue, totalDividends } }));
        }

        if (isMountedRef.current) {
            const cachedListStatistics = Cache.getItem('listStatistics');

            if (cachedListStatistics && !disableCache) {
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

            if (cachedListDividends && !disableCache) {
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


    useEffect(() => {
        console.log('isAuthenticated effect auth: ', isAuthenticated);
        if (isAuthenticated) {
            console.log('auth yes, getStatistics - getDividends');
            getStatistics();
            getDividends();
        }
    }, [isAuthenticated, getStatistics, getDividends]);

    const processRefetch = () => {
        console.log('refetching, clear cache');
        Cache.clear();
        getStatistics();
        getDividends();
    }


    return (
        <DataContext.Provider value={{
            ...state,
            processRefetch
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;