import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from 'react';
import { Cache, API, graphqlOperation } from 'aws-amplify';
import { listStatistics, listDividends, listPortfolios } from 'src/graphql/queries';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';

const disableCache = true;

const initialDataState = {
    loading: true,
    portfolios: [],
    listStatistics: {
        data: [],
        costBasis: 0,
        marketValue: 0,
        totalDividends: 0,
        sortedDividendData: [],
        sortedMarketValueData: [],
    },
    listDividends: {
        all: [],
        upcoming: []
    },
};

const DataContext = createContext({
    ...initialDataState,
    processRefetch: () => { },
    refetchPortfolios: () => { },
});

export const DataProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const isMountedRef = useIsMountedRef();

    const [state, setState] = useState(initialDataState);
    const [selectedPortfolios, setSelectedPortfolios] = React.useState({});

    const [isPortfoliosLoading, setIsPortfoliosLoading] = useState(true);
    const [isDividendsLoading, setIsDividendsLoading] = useState(true);
    const [isStatisticsLoading, setIsStatisticsLoading] = useState(true);
    const loading = isStatisticsLoading || isDividendsLoading || isPortfoliosLoading;

    /*
      Data
    */
    const getPortfolios = useCallback(async () => {
        if (isMountedRef.current) {
            setIsPortfoliosLoading(true);
            const cached = Cache.getItem('portfolios');

            if (cached && !disableCache) {
                console.log('portfolios already cached');
                setState(s => ({ ...s, portfolios: cached }));
            } else {
                console.log('caching portfolios');

                const { data } = await API.graphql(graphqlOperation(listPortfolios));
                // setState(s => ({ ...s, portfolios: data.listPortfolios.items }));
                setState(s => ({ ...s, portfolios: [{ id: 'default', name: 'Default' }, ...data.listPortfolios.items] }));
                try {
                    Cache.setItem(
                        'portfolios',
                        data.listPortfolios.items,
                        { expires: new Date().setHours(new Date().getHours() + 1) }
                    );
                } catch { }
                setIsPortfoliosLoading(false);
            }
        }
    }, [isMountedRef]);

    /*
        Statistics
    */
    const processStatistics = list => {
        console.log('processing statistics');
        setIsStatisticsLoading(true);
        let costBasis = 0;
        let marketValue = 0;
        let totalDividends = 0;

        list.forEach(holding => {
            costBasis += holding.costBasis;
            marketValue += holding.marketValue;
            totalDividends += holding.totalDividends;
        });

        const _sortedDividendData = [...list].sort((a, b) => (a.totalDividends < b.totalDividends) ? 1 : ((b.totalDividends < a.totalDividends) ? -1 : 0))
        const _sortedMarketValueData = [...list].sort((a, b) => (a.marketValue < b.marketValue) ? 1 : ((b.marketValue < a.marketValue) ? -1 : 0))

        setState(s => ({ ...s, listStatistics: { data: list, sortedMarketValueData: _sortedMarketValueData, sortedDividendData: _sortedDividendData, costBasis, marketValue, totalDividends } }));
        setIsStatisticsLoading(false);
    };
    const getStatistics = useCallback(async () => {
        if (isMountedRef.current) {
            setIsStatisticsLoading(true);
            const cachedListStatistics = Cache.getItem('listStatistics');

            if (cachedListStatistics && !disableCache) {
                console.log('listStatistics already cached');
                // processStatistics(cachedListStatistics);
            } else {
                console.log('caching listStatistics');

                const { data: listStatisticsData } = await API.graphql(graphqlOperation(listStatistics));
                const parsedListStatisticsData = JSON.parse(listStatisticsData.listStatistics);
                try {
                    Cache.setItem(
                        'listStatistics',
                        parsedListStatisticsData,
                        { expires: new Date().setHours(new Date().getHours() + 1) }
                    );
                } catch { }
                // processStatistics(parsedListStatisticsData);
            }

            setIsStatisticsLoading(false);
        }
    }, [isMountedRef]);

    /*
        Dividends
    */
    const processDividends = filteredDividends => {
        console.log('processing dividends');
        const dividendsObject = filteredDividends.reduce((a, v) => {
            const computedProperty = [`${v.symbol}-${v.paymentDate}`];

            if (a[computedProperty]) {
                const amount = Number(Number(a[computedProperty].extendedProps.amount) + Number(v.extendedProps.amount)).toFixed(2);
                a[computedProperty].title = `${a[computedProperty].symbol} $${amount}`;
                a[computedProperty].extendedProps.amount = amount;
                a[computedProperty].quantity = Number(a[computedProperty].quantity) + Number(v.quantity);
            } else {
                a[computedProperty] = v;
            }
            return a;
        }, {});

        const list = [];
        for (const key in dividendsObject) {
            list.push(dividendsObject[key]);
        }

        const upcoming = [];
        const yesterday = new Date().setDate(new Date().getDate() - 1);
        list.forEach(item => {
            if (new Date(item.paymentDate) > yesterday) {
                upcoming.push(item);
            }
        });

        setState(s => ({ ...s, listDividends: { all: list, upcoming } }));
        setIsDividendsLoading(false);
    }
    const getDividends = useCallback(async () => {
        if (isMountedRef.current) {
            setIsDividendsLoading(true);
            const cachedListDividends = Cache.getItem('listDividends');

            if (cachedListDividends && !disableCache) {
                console.log('listDividends already cached');
                // processDividends(cachedListDividends);
            } else {
                console.log('caching listDividends');

                const { data } = await API.graphql(graphqlOperation(listDividends));
                const parsed = JSON.parse(data.listDividends);
                try {
                    Cache.setItem(
                        'listDividends',
                        parsed,
                        { expires: new Date().setHours(new Date().getHours() + 1) }
                    );
                } catch { }
                // processDividends(parsed);
            }
            setIsDividendsLoading(false);
        }
    }, [isMountedRef]);

    /*
      Hooks
    */
    useEffect(() => {
        console.log('isAuthenticated effect auth: ', isAuthenticated);
        if (isAuthenticated) {
            console.log('auth yes, getStatistics - getDividends - getPortfolios');
            getPortfolios();
            getStatistics();
            getDividends();
        }
    }, [isAuthenticated, getStatistics, getDividends, getPortfolios]);

    useEffect(() => {
        if (state.portfolios.length) {
            try {
                const selectedPortfolios = localStorage.getItem('selectedPortfolios');
                if (selectedPortfolios) {
                    const parsed = JSON.parse(selectedPortfolios);
                    for (const key in parsed) {
                        if (!state.portfolios.some(e => e.id === key)) {
                            delete parsed[key];
                        }
                    }
                    setSelectedPortfolios(parsed);
                }
            } catch { }
        }
    }, [state.portfolios]);

    useEffect(() => {
        const portfolioIds = Object.entries(selectedPortfolios).map(([key, val]) => {
            if (val) {
                return key;
            } else {
                return undefined;
            }
        }).filter(e => e !== undefined);

        if (!loading) {
            if (portfolioIds.length) {
                const cachedListStatistics = Cache.getItem('listStatistics');
                const cachedListDividends = Cache.getItem('listDividends');

                const filteredStatistics = cachedListStatistics.filter(e => {
                    if (!e.portfolio && portfolioIds.includes('default')) {
                        return true;
                    } else if (e.portfolio && e.portfolio.id && portfolioIds.includes(e.portfolio.id)) {
                        return true;
                    }
                    return false;
                });

                const filteredDividends = cachedListDividends.filter(e => {
                    if (!e.portfolio && portfolioIds.includes('default')) {
                        return true;
                    } else if (e.portfolio && e.portfolio.id && portfolioIds.includes(e.portfolio.id)) {
                        return true;
                    }
                    return false;
                });

                processStatistics(filteredStatistics);
                processDividends(filteredDividends);
            } else {
                setSelectedPortfolios({ default: true });
            }
        }
    }, [selectedPortfolios, loading]);

    const processRefetch = () => {
        console.log('refetching, clear cache');
        Cache.clear();
        getStatistics();
        getDividends();
    };

    const refetchPortfolios = () => {
        console.log('refetching portfolios, clear cache');
        Cache.removeItem('portfolios');
        getPortfolios();
    };


    return (
        <DataContext.Provider value={{
            ...state,
            loading,
            processRefetch,
            refetchPortfolios,
            selectedPortfolios,
            setSelectedPortfolios
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;