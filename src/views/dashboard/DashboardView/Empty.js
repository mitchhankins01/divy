import React from 'react';
import clsx from 'clsx';
import {
    Box,
    Card,
    Typography,
    makeStyles,
    Link
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        // border: `3px solid ${theme.palette.secondary.main}`,
    },
}));

export default ({ className, ...rest }) => {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box flexGrow={1}>
                <Box>
                    <Typography
                        variant="h4"
                        gutterBottom
                        color="inherit"
                    >
                        Getting Started
                    </Typography>
                </Box>
                <Box py={1}>
                    <Typography variant="body1" color="inherit">
                        Welcome to Divy!
                    </Typography>
                </Box>
                <Box py={1}>
                    <Typography variant="body1" color="inherit">
                        Currently your account is empty and has no holdings. To get started, add one or more of your holdings.
                    </Typography>
                </Box>
                <Box py={1}>
                    <Typography variant="body1" color="inherit">
                        In order to do so, navigate to the "Holdings" page from the navigation menu.
                    </Typography>
                </Box>
                <Box py={1}>
                    <Typography variant="body1" color="inherit">
                        From there, select the "Add Holding" button and follow the prompts. Once you have done so this message will disappear.
                    </Typography>
                </Box>
                <Box py={1}>
                <Link
                        component={RouterLink}
                        to="/app/holdings/create"
                        variant="body1"
                        color="inherit"
                    >
                        Alternatively, you can click here to be immediately create a holding.
                    </Link>
                </Box>
                <Box py={1}>
                    <Typography variant="body1" color="inherit">
                        Feel free to use the chat functionality in the bottom right of your screen if you have any questions.
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

