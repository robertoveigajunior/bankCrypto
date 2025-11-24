import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchHistory } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SimulationResult {
    totalInvested: number;
    totalValue: number;
    roi: number;
    dates: string[];
    investedCurve: number[];
    valueCurve: number[];
}

const DCACalculator: React.FC = () => {
    const { t } = useLanguage();
    const { currency, rate } = usePortfolio();

    const [symbol, setSymbol] = useState('BTC');
    const [amount, setAmount] = useState(100);
    const [frequency, setFrequency] = useState('weekly'); // daily, weekly, monthly
    const [duration, setDuration] = useState(1); // years
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);

    const calculateDCA = async () => {
        setLoading(true);
        try {
            const days = duration * 365;
            const limit = Math.min(days, 1000);

            const history = await fetchHistory(symbol, '1d', limit);

            // Convert input amount to USD if currency is BRL
            // API works with USDT prices
            const amountInUSD = currency === 'BRL' ? amount / rate : amount;

            let totalInvestedUSD = 0;
            let totalCrypto = 0;
            const investedCurve: number[] = [];
            const valueCurve: number[] = [];
            const dates: string[] = [];

            const step = frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30;

            for (let i = 0; i < history.length; i += step) {
                const candle = history[i];
                const price = candle.price;

                totalInvestedUSD += amountInUSD;
                totalCrypto += amountInUSD / price;

                // Store values in selected currency for chart
                const investedVal = currency === 'BRL' ? totalInvestedUSD * rate : totalInvestedUSD;
                const currentVal = currency === 'BRL' ? (totalCrypto * price) * rate : (totalCrypto * price);

                investedCurve.push(investedVal);
                valueCurve.push(currentVal);
                dates.push(new Date(candle.time).toLocaleDateString());
            }

            const finalValueUSD = totalCrypto * history[history.length - 1].price;
            const totalInvestedFinal = currency === 'BRL' ? totalInvestedUSD * rate : totalInvestedUSD;
            const finalValueFinal = currency === 'BRL' ? finalValueUSD * rate : finalValueUSD;

            const roi = ((finalValueFinal - totalInvestedFinal) / totalInvestedFinal) * 100;

            setResult({
                totalInvested: totalInvestedFinal,
                totalValue: finalValueFinal,
                roi,
                dates,
                investedCurve,
                valueCurve
            });

        } catch (error) {
            console.error("Error calculating DCA:", error);
            alert("Error fetching data. Please check the symbol.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: result?.dates || [],
        datasets: [
            {
                label: t.dca.totalValue,
                data: result?.valueCurve || [],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.1,
                fill: true
            },
            {
                label: t.dca.totalInvested,
                data: result?.investedCurve || [],
                borderColor: '#888',
                borderDash: [5, 5],
                tension: 0.1,
                fill: false
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#fff' }
            },
            title: {
                display: true,
                text: `${t.dca.title}: ${symbol}`,
                color: '#fff'
            }
        },
        scales: {
            y: {
                grid: { color: '#333' },
                ticks: { color: '#aaa' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#aaa', maxTicksLimit: 10 }
            }
        }
    };

    return (
        <div className="dca-calculator">
            <div className="glass-panel" style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 8px 0' }}>{t.dca.title}</h2>
                <p style={{ margin: '0 0 24px 0', color: '#8b949e', fontSize: '14px' }}>{t.dca.description}</p>
                <div className="dca-form" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group">
                        <label>{t.dca.symbol}</label>
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            style={{ padding: '8px', borderRadius: '4px', background: '#222', border: '1px solid #444', color: '#fff' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.dca.amount} ({currency})</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            style={{ padding: '8px', borderRadius: '4px', background: '#222', border: '1px solid #444', color: '#fff' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.dca.frequency}</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', background: '#222', border: '1px solid #444', color: '#fff' }}
                        >
                            <option value="daily">{t.dca.frequencies.daily}</option>
                            <option value="weekly">{t.dca.frequencies.weekly}</option>
                            <option value="monthly">{t.dca.frequencies.monthly}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t.dca.duration}</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            style={{ padding: '8px', borderRadius: '4px', background: '#222', border: '1px solid #444', color: '#fff' }}
                        >
                            <option value={1}>{t.dca.years[1]}</option>
                            <option value={2}>{t.dca.years[2]}</option>
                            <option value={3}>{t.dca.years[3]}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>&nbsp;</label>
                        <button
                            onClick={calculateDCA}
                            disabled={loading}
                            style={{ padding: '8px 24px', borderRadius: '4px', background: '#00ff88', color: '#222', border: 'none', fontWeight: 'bold', cursor: 'pointer', height: '36px', width: '100%' }}
                        >
                            {loading ? t.dca.calculating : t.dca.calculate}
                        </button>
                    </div>
                </div>
            </div>

            {result && (
                <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div className="glass-panel">
                        <span style={{ color: '#aaa', fontSize: '14px' }}>{t.dca.totalInvested}</span>
                        <h3 style={{ margin: '5px 0', fontSize: '24px' }}>
                            {currency === 'BRL' ? 'R$' : '$'}{result.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="glass-panel">
                        <span style={{ color: '#aaa', fontSize: '14px' }}>{t.dca.totalValue}</span>
                        <h3 style={{ margin: '5px 0', fontSize: '24px', color: '#00ff88' }}>
                            {currency === 'BRL' ? 'R$' : '$'}{result.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="glass-panel">
                        <span style={{ color: '#aaa', fontSize: '14px' }}>{t.dca.roi}</span>
                        <h3 style={{ margin: '5px 0', fontSize: '24px', color: result.roi >= 0 ? '#00ff88' : '#ff4444' }}>
                            {result.roi > 0 ? '+' : ''}{result.roi.toFixed(2)}%
                        </h3>
                    </div>
                </div>
            )}

            {result && (
                <div className="glass-panel">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default DCACalculator;
