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
    Filler,
    ChartData,
    ChartOptions
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

interface Holding {
    symbol: string;
    quantity: number | string;
}

interface PriceChartProps {
    symbol: string;
    holdings?: Holding[];
}

const PriceChart: React.FC<PriceChartProps> = ({ holdings = [] }) => {
    const [timeframe, setTimeframe] = useState<'1W' | '1M'>('1M'); // 1W or 1M
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

    useEffect(() => {
        const getData = async () => {
            const interval = timeframe === '1W' ? '4h' : '1d';
            const limit = timeframe === '1W' ? 42 : 30;

            try {
                // Always fetch BTC
                const btcData = await fetchHistory('BTC', interval, limit);

                // Fetch others
                const otherSymbols = [...new Set(holdings.map(h => h.symbol).filter(s => s !== 'BTC'))];
                const otherDataPromises = otherSymbols.map(s => fetchHistory(s, interval, limit).then(data => ({ symbol: s, data })));
                const othersData = await Promise.all(otherDataPromises);

                const labels = btcData.map(d => {
                    const date = new Date(d.time);
                    return timeframe === '1W'
                        ? date.toLocaleDateString() + ' ' + date.getHours() + ':00'
                        : date.toLocaleDateString();
                });

                const datasets = [
                    {
                        label: 'BTC Price (USDT)',
                        data: btcData.map(d => d.price),
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        order: 1,
                        yAxisID: 'y',
                    },
                    ...othersData.map((item, index) => {
                        const colors = ['#0088ff', '#ff0088', '#ffff00', '#ff8800'];
                        const color = colors[index % colors.length];
                        return {
                            label: `${item.symbol} Price (USDT)`,
                            data: item.data.map(d => d.price),
                            borderColor: color,
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            borderDash: [5, 5],
                            order: 2,
                            yAxisID: 'y1', // Use secondary axis for others to handle scale differences
                        };
                    })
                ];

                setChartData({ labels, datasets });
            } catch (error) {
                console.error("Failed to load chart data", error);
            }
        };

        getData();
    }, [holdings, timeframe]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { color: '#ccc' }
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
                grid: { display: false, drawBorder: false },
                ticks: { color: '#666', maxTicksLimit: 7 }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: '#00ff88', callback: (value) => '$' + value.toLocaleString() }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false }, // only want the grid lines for one axis to show up
                ticks: { color: '#0088ff', callback: (value) => '$' + value.toLocaleString() }
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
