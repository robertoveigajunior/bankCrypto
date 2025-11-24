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
import { usePortfolio } from '../context/PortfolioContext';

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
    symbol?: string;
    holdings?: Holding[];
    type?: 'asset' | 'portfolio';
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol = 'BTC', holdings = [], type = 'asset' }) => {
    const { currency, rate } = usePortfolio();
    const [timeframe, setTimeframe] = useState<'1W' | '1M'>('1M'); // 1W or 1M
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

    useEffect(() => {
        const getData = async () => {
            const interval = timeframe === '1W' ? '4h' : '1d';
            const limit = timeframe === '1W' ? 42 : 30;

            try {
                // Always fetch BTC to get timestamps/labels
                const btcData = await fetchHistory('BTC', interval, limit);

                const labels = btcData.map(d => {
                    const date = new Date(d.time);
                    return timeframe === '1W'
                        ? date.toLocaleDateString() + ' ' + date.getHours() + ':00'
                        : date.toLocaleDateString();
                });

                // Helper to convert price based on currency
                const convert = (val: number) => currency === 'BRL' ? val * rate : val;

                if (type === 'portfolio') {
                    if (holdings.length === 0) {
                        setChartData({
                            labels,
                            datasets: [{
                                label: `Portfolio Value (${currency})`,
                                data: new Array(labels.length).fill(0),
                                borderColor: '#00ff88',
                                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                tension: 0.4,
                                fill: true,
                            }]
                        });
                        return;
                    }

                    const uniqueSymbols = [...new Set(holdings.map(h => h.symbol))];
                    const historyPromises = uniqueSymbols.map(s => fetchHistory(s, interval, limit).then(data => ({ symbol: s, data })));
                    const histories = await Promise.all(historyPromises);

                    // Calculate total value for each timestamp
                    const portfolioHistory = btcData.map((_, index) => {
                        let total = 0;
                        holdings.forEach(h => {
                            const history = histories.find(hist => hist.symbol === h.symbol);
                            if (history && history.data[index]) {
                                total += history.data[index].price * parseFloat(h.quantity as string);
                            }
                        });
                        return convert(total);
                    });

                    setChartData({
                        labels,
                        datasets: [{
                            label: `Total Portfolio Value (${currency})`,
                            data: portfolioHistory,
                            borderColor: '#00ff88',
                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                        }]
                    });

                } else {
                    // Asset Mode (Existing Logic)
                    const otherSymbols = [...new Set(holdings.map(h => h.symbol).filter(s => s !== 'BTC'))];
                    const otherDataPromises = otherSymbols.map(s => fetchHistory(s, interval, limit).then(data => ({ symbol: s, data })));
                    const othersData = await Promise.all(otherDataPromises);

                    const datasets = [
                        {
                            label: `BTC Price (${currency})`,
                            data: btcData.map(d => convert(d.price)),
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
                                label: `${item.symbol} Price (${currency})`,
                                data: item.data.map(d => convert(d.price)),
                                borderColor: color,
                                backgroundColor: 'transparent',
                                tension: 0.4,
                                fill: false,
                                pointRadius: 0,
                                pointHoverRadius: 6,
                                borderDash: [5, 5],
                                order: 2,
                                yAxisID: 'y1',
                            };
                        })
                    ];
                    setChartData({ labels, datasets });
                }
            } catch (error) {
                console.error("Failed to load chart data", error);
            }
        };

        getData();
    }, [holdings, timeframe, type, symbol, currency, rate]);

    useEffect(() => {
        const handleResize = () => {
            if (chartData) {
                setChartData({ ...chartData }); // Trigger re-render
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [chartData]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
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
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
                                style: 'currency',
                                currency: currency
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#666', maxTicksLimit: 7 }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#00ff88',
                    callback: (value) => {
                        if (typeof value === 'number') {
                            return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
                                style: 'currency',
                                currency: currency,
                                notation: 'compact',
                                maximumFractionDigits: 1
                            }).format(value);
                        }
                        return value;
                    }
                }
            },
            y1: {
                type: 'linear',
                display: type === 'asset' && holdings.some(h => h.symbol !== 'BTC') ? true : false,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: {
                    color: '#0088ff',
                    callback: (value) => {
                        if (typeof value === 'number') {
                            return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
                                style: 'currency',
                                currency: currency,
                                notation: 'compact',
                                maximumFractionDigits: 1
                            }).format(value);
                        }
                        return value;
                    }
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
                <h3>{type === 'portfolio' ? 'Portfolio Value History' : 'Price History'}</h3>
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
