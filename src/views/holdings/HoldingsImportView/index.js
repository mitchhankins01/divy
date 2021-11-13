import React from 'react';
import {
    Box,
    Card,
    Grid,
    makeStyles,
    Button,
    Typography,
    LinearProgress,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import Header from './Header';
import useData from 'src/hooks/useData';
import Page from 'src/components/Page';
import { importHoldings } from 'src/graphql/queries';
import Review from './Review';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.dark,
    },
    brokerFormControl: {
        minWidth: 200,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}));

export default () => {
    const classes = useStyles();
    const [error, setError] = React.useState(null);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const { processRefetch, portfolios } = useData();
    const [selectedBroker, setSelectedBroker] = React.useState('');
    const [selectedPortfolio, setSelectedPortfolio] = React.useState('default');
    const [importHoldingsResponse, setImportHoldingsResponse] = React.useState(null);

    const onUploadFile = async (event) => {
        try {
            setError(null);
            setLoading(true);
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.append('file', selectedFile);
            // const s3Result = await Storage.put(selectedFile.name, selectedFile, { contentType: selectedFile.type });
            const s3Result = await Storage.put(`${new Date().getTime()}.xlsx`, selectedFile, { contentType: selectedFile.type });
            const { data } = await API.graphql(graphqlOperation(importHoldings, { type: selectedBroker, selectedPortfolioId: selectedPortfolio, fileKey: s3Result.key }));
            setImportHoldingsResponse(data.importHoldings);
            await Storage.remove(s3Result.key);
            if (data.importHoldings.newSymbols.length || data.importHoldings.updateSymbols.length) {
                processRefetch();
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Your upload is malformed, please try again or use the chat to get help.');
        }
    };

    const handleTabChange = (_, newValue) => {
        setError(null);
        setTabIndex(newValue);
        setSelectedBroker(newValue === 0 ? '' : 'spreadsheet');
    };

    const resetHoldingsResponse = () => {
        setLoading(false);
        setImportHoldingsResponse(null);
    };

    const handleSelectPortfolioChange = (event) => {
        setSelectedPortfolio(event.target.value);
    };

    if (importHoldingsResponse) {
        return <Review data={importHoldingsResponse} resetHoldingsResponse={resetHoldingsResponse} />
    }

    const renderSpreadSheetImport = () => (
        <>
            <Box p={1}>
                <Typography variant="body1">
                    Step 1: Select which of your porfolios you'd like to import to.
                </Typography>
                <FormControl className={classes.brokerFormControl}>
                    <InputLabel>Portfolio</InputLabel>
                    <Select disabled={loading} value={selectedPortfolio} onChange={handleSelectPortfolioChange}>
                        {portfolios.map(e => (
                            <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 2:
                    <Button disabled={loading} style={{ marginLeft: 5 }} variant="outlined" size='small' component="a" href='/import.xlsx' download>
                        Download the spreadsheet template
                    </Button>
                </Typography>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 3: Under the header "symbol" list your holdings.
                </Typography>
                <Typography color='textPrimary' variant="body1" component="a" href="https://finance.yahoo.com/" rel="noopener noreferrer" target="_blank">
                    NOTE: You must use the same structure as Yahoo Finance, click here to check your symbol.
                </Typography>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 4: Under the header "numberOfShares" enter the number of shares you own per holding.
                </Typography>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 5: Under the header "pricePerShare" enter your cost basis per holding.
                </Typography>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 6: Upload your spreadsheet.
                </Typography>
            </Box>
            <Box p={1}>
                <Typography variant="body1">
                    Step 7: Review the import.
                </Typography>
            </Box>
            <Box p={1}>
                <input
                    accept=".xlsx"
                    className={classes.input}
                    id="contained-button-file"
                    hidden
                    type="file"
                    onChange={onUploadFile}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="outlined" color="primary" component="span" startIcon={<CloudUpload />} disabled={Boolean(loading)}>
                        {loading ? 'Processing' : 'Upload My Spreadsheet'}
                    </Button>
                </label>
            </Box>
        </>
    );

    const renderBrokerImport = () => {
        const handleSelectBrokerChange = (event) => {
            setSelectedBroker(event.target.value);
        };

        return (
            <>
                <Box p={1}>
                    <Typography variant="body1">
                        Step 1: Select your broker. <br /> If it is not listed {'\n'}
                        <Typography color='textPrimary' variant="body1" component="a" href='mailto:support@divytracker.com?subject=Add Broker Import' rel="noopener noreferrer">
                            click here
                        </Typography>
                        {' '}to send an email and attach your broker's CSV file, it will only take a few days to add support for your broker.
                    </Typography>
                    <FormControl className={classes.brokerFormControl}>
                        <InputLabel>Broker</InputLabel>
                        <Select disabled={loading} value={selectedBroker} onChange={handleSelectBrokerChange}>
                            {[
                                { value: 'fidelity', label: 'Fidelity' },
                                { value: 'tastyworks', label: 'TastyWorks' },
                            ].map(e => (
                                <MenuItem value={e.value} key={e.value}>{e.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box p={1}>
                    <Typography variant="body1">
                        Step 2: Select which of your porfolios you'd like to import to.
                    </Typography>
                    <FormControl className={classes.brokerFormControl}>
                        <InputLabel>Portfolio</InputLabel>
                        <Select disabled={loading} value={selectedPortfolio} onChange={handleSelectPortfolioChange}>
                            {portfolios.map(e => (
                                <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box p={1}>
                    <Typography variant="body1">
                        Step 3: Upload your broker's CSV file.
                    </Typography>
                </Box>
                <Box p={1}>
                    <input
                        accept=".csv"
                        className={classes.input}
                        id="contained-button-file"
                        hidden
                        type="file"
                        onChange={onUploadFile}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" color="primary" component="span" startIcon={<CloudUpload />} disabled={Boolean(loading) || !selectedBroker}>
                            {loading ? 'Processing' : 'Upload My Broker CSV'}
                        </Button>
                    </label>
                </Box>
            </>
        );
    };

    return (
        <Page className={classes.root} title='Import'>
            <Header />
            <Grid item lg={12} xs={12}>
                <Box mt={2}>
                    <Card>
                        {loading && <LinearProgress />}
                        <Tabs value={tabIndex} variant='fullWidth' onChange={handleTabChange}>
                            <Tab disabled={loading} value={0} label='Broker Import' />
                            <Tab disabled={loading} value={1} label='Spreadsheet Import' />
                        </Tabs>
                        <Box p={2}>
                            {error && (
                                <Box p={1}>
                                    <Typography variant="h4" color='error'>{error}</Typography>
                                </Box>
                            )}
                            <Box p={1}>
                                <Typography variant="h3">Instructions</Typography>
                            </Box>
                            {tabIndex === 0 ? renderBrokerImport() : renderSpreadSheetImport()}
                        </Box>
                    </Card>
                </Box>
            </Grid>
        </Page>
    );
};
