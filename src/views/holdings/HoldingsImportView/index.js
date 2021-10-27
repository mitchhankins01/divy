import React from 'react';
import {
    Box,
    Card,
    Grid,
    makeStyles,
    Button,
    Typography,
    LinearProgress,
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import Header from './Header';
import useData from 'src/hooks/useData';
import Page from 'src/components/Page';
import { importHoldings } from 'src/graphql/queries';
import Review from './Review';
// import { deleteHolding } from 'src/graphql/mutations';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.dark,
    },
}));

export default () => {
    const classes = useStyles();
    const { listStatistics } = useData();
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [importHoldingsResponse, setImportHoldingsResponse] = React.useState(null);

    const onUploadFile = async (event) => {
        // const { data } = await API.graphql(graphqlOperation(listHoldings));

        // for (const item of data?.listHoldings?.items) {
        //     await API.graphql(graphqlOperation(deleteHolding, { input: { id: item.id } }));
        //     console.log(`Deleted ${item.symbol}`);
        // }
        // processRefetch();
        // return;

        try {
            setLoading(true);
            const selectedFile = event.target.files[0];
            const existingSymbols = listStatistics.data.map(item => item.symbol).join(',');
            const formData = new FormData();
            formData.append('file', selectedFile);
            const s3Result = await Storage.put(`${new Date().getTime()}.xlsx`, selectedFile, { contentType: selectedFile.type });
            const { data } = await API.graphql(graphqlOperation(importHoldings, { existingSymbols, fileKey: s3Result.key }));
            setImportHoldingsResponse(data.importHoldings);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Your spreadsheet is malformed, please try again or use the chat to get help.');
        }
    };

    const resetHoldingsResponse = () => {
        setLoading(false);
        setImportHoldingsResponse(null);
    };

    if (importHoldingsResponse) {
        return <Review data={importHoldingsResponse} resetHoldingsResponse={resetHoldingsResponse} />
    }

    return (
        <Page className={classes.root} title='Import'>
            <Header />
            <Grid item lg={12} xs={12}>
                <Box mt={2}>
                    <Card>
                        {loading && <LinearProgress />}
                        <Box p={2}>
                            {error && (
                                <Box p={1}>
                                    <Typography variant="h4" color='error'>{error}</Typography>
                                </Box>
                            )}
                            <Box p={1}>
                                <Typography variant="h3">Instructions</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 1:
                                    <Button disabled={loading} style={{ marginLeft: 5 }} variant="outlined" size='small' component="a" href='/import.xlsx' download>
                                        Download the spreadsheet template
                                    </Button>
                                </Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 2: Under the header "symbol" list your holdings.
                                </Typography>
                                <Typography color='textPrimary' variant="body1" component="a" href="https://finance.yahoo.com/" rel="noopener noreferrer" target="_blank">
                                    NOTE: You must use the same structure as Yahoo Finance, click here to check your symbol.
                                </Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 3: Under the header "numberOfShares" enter the number of shares you own per holding.
                                </Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 4: Under the header "pricePerShare" enter your cost basis per holding.
                                </Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 5: Upload your spreadsheet.
                                </Typography>
                                <Typography variant="body1">
                                    NOTE: In the next screen you must review the result of the import before the holdings are added to your portfolio.
                                </Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="body1">
                                    Step 6: Review the import and make sure to submit it to add the holdings to your portfolio.
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
                        </Box>
                    </Card>
                </Box>
            </Grid>
        </Page>
    );
};
