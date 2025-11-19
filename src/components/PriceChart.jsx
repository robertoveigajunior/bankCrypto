import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchHistory } from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PriceChart = ({ symbol }) => {
    const [timeframe, setTimeframe] = useState('1M'); // 1W or 1M
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const interval = timeframe === '1W' ? '4h' : '1d';
            const limit = timeframe === '1W' ? 42 : 30; // 7 days * 6 (4h candles) = 42

            try {
                const data = await fetchHistory(symbol, interval, limit);

                setChartData({
                    labels: data.map(d => {
                        const date = new Date(d.time);
                        return timeframe === '1W'
                            ? date.toLocaleDateString() + ' ' + date.getHours() + ':00'
                            : date.toLocaleDateString();
                    }),
                    datasets: [
                        {
                            label: `${symbol} Price (USDT)`,
                            data: data.map(d => d.price),
                            borderColor: '#00ff88',
                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to load chart data", error);
            }
        };

        getData();
    }, [symbol, timeframe]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(20, 20, 20, 0.9)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: '#333',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#666',
                    maxTicksLimit: 7,
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#666',
                    callback: (value) => '$' + value.toLocaleString()
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="chart-container glass-panel">
            <div className="chart-header">
                <h3>Price History</h3>
                <div className="timeframe-selector">
                    <button
                        className={timeframe === '1W' ? 'active' : ''}
                        onClick={() => setTimeframe('1W')}
                    >
                        1 Week
                    </button>
                    <button
                        className={timeframe === '1M' ? 'active' : ''}
                        onClick={() => setTimeframe('1M')}
                    >
                        1 Month
                    </button>
                </div>
            </div>
            <div className="chart-wrapper">
                {chartData ? <Line options={options} data={chartData} /> : <p>Loading chart...</p>}
            </div>
        </div>
    );
};

export default PriceChart;
