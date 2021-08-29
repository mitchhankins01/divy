import React from 'react';
import {
    Box,
    Button,
    Grid,
    Typography
} from '@material-ui/core';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listHoldings } from '../../graphql/queries';
import { createHolding, deleteHolding } from '../../graphql/mutations';
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef()

export default () => {
    const log = ['Log'];
    const [uploadData, setUploadData] = React.useState([]);

    const onSubmit = async () => {
        const { attributes } = await Auth.currentAuthenticatedUser();
        const { data } = await API.graphql(graphqlOperation(listHoldings));

        for (const item of data?.listHoldings?.items) {
            await API.graphql(graphqlOperation(deleteHolding, { input: { id: item.id } }));
            log.push(`Deleted ${item.symbol}`);
            console.log(`Deleted ${item.symbol}`);
        }

        for (const item of uploadData) {
            await API.graphql(graphqlOperation(createHolding, {
                input: {
                    price: item.price,
                    owner: attributes.sub,
                    quantity: item.quantity,
                    symbol: String(item.symbol).toUpperCase(),
                    comments: 'Auto Import',
                }
            }));
            console.log(`Inserted ${item.symbol}`);
            log.push(`Inserted ${item.symbol}`);
        }
    }

    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }

    const handleOnFileLoad = (data) => {
        const result = [];
        data.forEach((item, index) => {
            if (index > 0 && item.data.length > 1) {
                if (item.data[1] === 'AAPL') {
                    console.log('iTs pear time');
                    result.push({
                        symbol: item.data[1],
                        quantity: Number(item.data[3].replace(',', '')) + 80,
                        price: Math.abs(item.data[22]),
                    });
                    return;
                } if (item.data[1] === 'GPC') {
                    console.log('iTs gpc time');
                    result.push({
                        symbol: item.data[1],
                        quantity: Number(item.data[3].replace(',', '')) + 50,
                        price: Math.abs(item.data[22]),
                    });
                    return;
                } if (item.data[1] === 'KMI') {
                    console.log('iTs KMI time');
                    result.push({
                        symbol: item.data[1],
                        quantity: Number(item.data[3].replace(',', '')) + 300,
                        price: Math.abs(item.data[22]),
                    });
                    return;
                } else {
                    console.log('now,', item.data[1])
                    result.push({
                        symbol: String(item.data[1]).toUpperCase().replace(/[\W_]+/g, '-'),
                        quantity: Number(item.data[3].replace(',', '')),
                        price: Math.abs(item.data[22]),
                    });
                }
            }
        });
        result.push({
            symbol: 'JPM',
            quantity: 55,
            price: 92.77,
        });
        result.push({
            symbol: 'AMZN',
            quantity: 3,
            price: 1753.62
        });
        console.log(result)
        setUploadData(result);
    }

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    const handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e)
        }
    }

    return (
        <Box mt={3}>
            <Grid item lg={4}>
                <Box mt={3}>
                    <CSVReader
                        ref={buttonRef}
                        onFileLoad={handleOnFileLoad}
                        onError={handleOnError}
                        noClick
                        noDrag
                    >
                        {({ file }) => (
                            <aside >
                                <Button fullWidth onClick={handleRemoveFile}>
                                    Remove File
                                </Button>
                                <div>
                                    {file && file.name}
                                </div>
                                <Button fullWidth onClick={handleOpenDialog}>
                                    Browse File
                                </Button>
                            </aside>
                        )}
                    </CSVReader>
                    <Button fullWidth onClick={onSubmit} disabled={!uploadData.length}>Submit</Button>
                </Box>
            </Grid>
            <Grid item lg={4}>
                <Box mt={3}>
                    {log.map((each, i) => <Typography key={each + i}>{'\n' + each}</Typography>)}
                </Box>
            </Grid>
        </Box>
    )
};