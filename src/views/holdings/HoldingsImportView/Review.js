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
} from '@material-ui/core';
import { Warning, Check, Cached } from '@material-ui/icons';
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
    },
}));

export default (props) => {
    const classes = useStyles();
    const { loading } = useData();

    return (
        <Card className={classes.root}>
            <Box p={3}>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <Button disabled={loading} variant='outlined' onClick={props.resetHoldingsResponse}>Go Back</Button>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography variant="h4">Ignored</Typography>
                        <Typography variant="body1">
                            These holdings have been ignored.
                        </Typography>
                        <List dense={true}>
                            {((props && props.data && props.data.failSymbols) || []).map(item => (
                                <ListItem key={item.id}>
                                    <ListItemIcon>
                                        <Warning />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.symbol}
                                        secondary={item.reason}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography variant="h4">Updated</Typography>
                        <Typography variant="body1">
                            These holdings have been updated.
                        </Typography>
                        <List dense={true}>
                            {((props && props.data && props.data.updateSymbols) || []).map(item => (
                                <ListItem key={item.id}>
                                    <ListItemIcon>
                                        <Cached />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.symbol}
                                        secondary={item.reason}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography variant="h4">Added</Typography>
                        <Typography variant="body1">
                            These holdings have been added.
                        </Typography>
                        <List dense={true}>
                            {((props && props.data && props.data.newSymbols) || []).map(item => (
                                <ListItem key={item.id}>
                                    <ListItemIcon>
                                        <Check />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.symbol}
                                        secondary={item.reason}
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
