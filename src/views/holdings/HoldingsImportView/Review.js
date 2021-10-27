import React from 'react';
import {
    Button,
    makeStyles,
    Card,
    Grid,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress
} from '@material-ui/core';
import { Warning, Check } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { createHolding } from 'src/graphql/mutations';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
    },
}));

export default (props) => {
    const classes = useStyles();
    const history = useHistory();
    const { processRefetch } = useData();
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
   
    const onSubmitFinishReview = async () => {
        try {
            setLoading(true);
            const { attributes } = await Auth.currentAuthenticatedUser();

            await Promise.all(props.data.successSymbols.map(async item => {
                return await API.graphql(graphqlOperation(createHolding, {
                    input: {
                        price: item.pricePerShare,
                        comments: item.comments,
                        quantity: item.numberOfShares,
                        owner: attributes.sub,
                        symbol: item.symbol,
                    }
                }));
            }));

            processRefetch();
            enqueueSnackbar('Import Complete', { variant: 'success' });
            history.push('/app/holdings');
        } catch (error) {
            setLoading(false);
            setError(JSON.stringify(error));
        }
    }

    return (
        <Card className={classes.root}>
            <Box p={3}>
                <Grid container spacing={3}>
                    <Grid item lg={2}>
                        <Button disabled={loading} variant='outlined' onClick={props.resetHoldingsResponse}>Go Back</Button>
                    </Grid>
                    <Grid item lg={7}>
                        {loading && <LinearProgress />}
                        <Typography variant="body1" color='error'>
                            {loading ?
                                'Loading, please do not navigate away from this page to prevent errors.' :
                                'NOTE: Your holdings will not be added to your portfolio untill you\'ve selected the "Finish Review" button.'
                            }
                        </Typography>
                    </Grid>
                    {error && (
                        <Box p={1}>
                            <Typography variant="h4" color='error'>{error}</Typography>
                        </Box>
                    )}
                    <Grid item lg={3}>
                        <Button style={{ float: 'right' }} disabled={!props.data.successSymbols.length || loading} onClick={onSubmitFinishReview} variant='contained' color='secondary'>Finish Review</Button>
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h3">Errors</Typography>
                        <Typography variant="body1">
                            These holdings could not be processed and will not be added once you submit.
                        </Typography>
                        <List dense={true}>
                            {((props && props.data && props.data.failSymbols) || []).map(item => (
                                <ListItem key={item.id}>
                                    <ListItemIcon>
                                        <Warning />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.reason}
                                        secondary={item.symbol}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h3">Success</Typography>
                        <Typography variant="body1">
                            These holdings were processed successfully and will be added once you submit.
                        </Typography>
                        <List dense={true}>
                            {((props && props.data && props.data.successSymbols) || []).map(item => (
                                <ListItem key={item.id}>
                                    <ListItemIcon>
                                        <Check />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.reason}
                                        secondary={item.symbol}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};
