import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const HistoricalChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return;
        }

        const ctx = chartRef.current.getContext('2d');

        const labels = Array.from({ length: data.length }, (_, i) => `Day ${i + 1}`);

        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // x-axis labels
                datasets: [{
                    label: 'Stock Price',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    data: data // y-axis data
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.3)', // Lighter color for dark mode
                            borderColor: 'white', // Border color for the axis
                            borderWidth: 2, // Width of the border
                            lineWidth: 2 // Width of the gridlines
                        },
                        ticks: {
                            color: '#e0e0e0' // Ensuring tick labels are visible in dark mode
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255,255,255,0.3)', // Making gridlines more visible
                            borderColor: 'white',
                            borderWidth: 2,
                            lineWidth: 2
                        },
                        ticks: {
                            color: '#e0e0e0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0' // For legend text in dark mode
                        }
                    }
                }
            }
        });

        return () => {
            chartInstance.destroy();
        };
    }, [data]);

    return <canvas ref={chartRef} id="stockChart" width="400" height="200"></canvas>;
};

export default HistoricalChart;