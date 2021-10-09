import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import ReactJson from 'react-json-view';
import { Box, Button, Card, CardContent, CardHeader, IconButton } from '@material-ui/core';
import { listStripeEvents } from 'src/graphql/queries';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { DeleteOutline } from '@material-ui/icons';
import { deleteStripeEvent } from 'src/graphql/mutations';

export default () => {
    const isMountedRef = useIsMountedRef();
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        if (isMountedRef.current) {
            setLoading(true);
            const { data } = await API.graphql(graphqlOperation(listStripeEvents));
            setEvents(data.listStripeEvents.items.reverse())
            setLoading(false);
        }
    }, [isMountedRef]);

    React.useEffect(() => { getData() }, [getData]);

    return (
        <Box p={5} mt={0}>
            <Button disabled={loading} onClick={getData}>Refresh</Button>
            {loading && 'Loading...'}
            {events.map(event => (
                <Box key={event.id} marginY={3}>
                    {console.log(JSON.parse(event.message))}
                    <Card>
                        <CardHeader
                            title={event.type}
                            subheader={event.createdAt.replace('T', ' ').slice(0, 19)}
                            action={
                                <IconButton onClick={async () => {
                                    if (window.confirm('Delete?')) {
                                        await API.graphql(graphqlOperation(deleteStripeEvent, { input: { id: event.id } }));
                                        getData();
                                    }
                                }}>
                                    <DeleteOutline />
                                </IconButton>
                            }
                        />
                        <CardContent>
                            <ReactJson collapsed={1} theme='solarized' src={JSON.parse(event.message)} />
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    )
};