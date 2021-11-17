import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    Breadcrumbs,
    Button,
    Grid,
    Link,
    SvgIcon,
    Typography,
    makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
    PlusCircle as PlusCircleIcon,
} from 'react-feather';
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
    root: {},
    button: {
        height: 56,
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0
        },
    },
    deleteButton: {
        height: 56,
        color: 'red',
        border: '1px solid red',
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0
        },
    }
}));

export default ({
    className,
    ...rest
}) => {
    const classes = useStyles();
    const { loading } = useData();

    return (
        <Grid
            className={clsx(classes.root, className)}
            container
            justify="space-between"
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/portfolios"
                        component={RouterLink}
                    >
                        Portfolios
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        List
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Portfolio List
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    className={classes.button}
                    color='secondary'
                    variant='contained'
                    component={RouterLink}
                    disabled={loading}
                    to='/app/portfolios/create'
                    startIcon={
                        <SvgIcon fontSize='small'>
                            <PlusCircleIcon />
                        </SvgIcon>
                    }
                >
                    New Portfolio
                </Button>
            </Grid>
        </Grid>
    );
};

