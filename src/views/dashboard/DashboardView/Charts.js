import React from 'react';
import palette from 'google-palette';
import 'chartjs-plugin-piechart-outlabels';
import { useTheme } from '@material-ui/core';
import { Pie, Bar, HorizontalBar, Doughnut } from 'react-chartjs-2';

export default ({ type, labels, data = [] }) => {
    const theme = useTheme();
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
    };
    const datasets = {
        data,
        borderWidth: 2,
        borderColor: theme.palette.background.default,
        hoverBorderColor: theme.palette.background.default,
        backgroundColor: palette(['tol-dv'], data.length).map(hex => `#${hex}`),
    };
    const niceData = { labels, datasets: [datasets] };

    if (type === 'horizontalBar') {
        return (
            <HorizontalBar
                data={niceData}
                options={{
                    ...options,
                    scales: { xAxes: [{ ticks: { callback: value => `${value}%` } }] },
                }}
            />
        );
    } else if (type === 'bar') {
        return (
            <Bar
                data={niceData}
                options={{
                    ...options,
                    scales: { yAxes: [{ ticks: { callback: value => `${value}%` } }] },
                }}
            />
        );
    } else if (type === 'doughnut') {
        return (
            <Doughnut
                data={niceData}
                options={{
                    ...options,
                    zoomOutPercentage: 80,
                    layout: { padding: 150 },
                    plugins: {
                        outlabels: {
                            color: 'black',
                            text: ({ dataset, dataIndex, labels }) => {
                                return `${labels[dataIndex]} ${dataset.data[dataIndex]}%`
                            },
                        }
                    }
                }}
            />
        );
    } else {
        return (
            <Pie
                data={niceData}
                options={{
                    ...options,
                    cutoutPercentage: 10,
                    zoomOutPercentage: 80,
                    layout: { padding: 150 },
                    plugins: {
                        outlabels: {
                            color: 'black',
                            text: ({ dataset, dataIndex, labels }) => {
                                return `${labels[dataIndex]} ${dataset.data[dataIndex]}%`
                            },
                        }
                    }
                }}
            />
        );
    }
};


