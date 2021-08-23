import React from 'react';
import palette from 'google-palette';
import 'chartjs-plugin-piechart-outlabels';
import { useTheme } from '@material-ui/core';
import { Pie, Bar, HorizontalBar } from 'react-chartjs-2';

export default ({ type, labels, data = [] }) => {
    const theme = useTheme();

    const generateColors = palette(['tol-dv'], data.length).map(function (hex) {
        return '#' + hex;
    });

    if (type === 'horizontalBar') {
        return (
            <HorizontalBar
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false, position: 'left' },
                    scales: { xAxes: [{ ticks: { callback: value => `${value}%` } }] },
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            data,
                            borderWidth: 2,
                            borderColor: theme.palette.background.default,
                            hoverBorderColor: theme.palette.background.default,
                            backgroundColor: generateColors
                        }
                    ],
                }}
            />
        );
    } else if (type === 'bar') {
        return (
            <Bar
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false, position: 'left' },
                    scales: { yAxes: [{ ticks: { callback: value => `${value}%` } }] },
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            data,
                            borderWidth: 2,
                            borderColor: theme.palette.background.default,
                            hoverBorderColor: theme.palette.background.default,
                            backgroundColor: generateColors
                        }
                    ],
                }}
            />
        );
    } else if (type === 'pie') {
        return (
            <Pie
                options={{
                    responsive: true,
                    cutoutPercentage: 10,
                    zoomOutPercentage: 80,
                    maintainAspectRatio: false,
                    layout: { padding: 150, },
                    legend: { display: false, position: 'left' },
                    plugins: {
                        outlabels: {
                            color: 'black',
                            text: ({ dataset, dataIndex, labels }) => {
                                return `${labels[dataIndex]} ${dataset.data[dataIndex]}%`
                            },
                        }
                    }
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            data,
                            borderWidth: 2,
                            borderColor: theme.palette.background.default,
                            hoverBorderColor: theme.palette.background.default,
                            backgroundColor: generateColors
                        }
                    ],
                }}
            />
        );
    }
};


