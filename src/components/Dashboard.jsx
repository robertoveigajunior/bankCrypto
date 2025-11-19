import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { fetchPrice } from '../services/api';
import PriceChart from './PriceChart';
import HoldingsForm from './HoldingsForm';

const Dashboard = () => {
    const { holdings, currency, setCurrency } = usePortfolio();
    const [btcPrice, setBtcPrice] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [loading, setLoading] = useState(true);

    // Exchange rate (mocked for simplicity if not fetching, but we can try to fetch or just use a fixed rate for demo)
    // In a real app, we'd fetch USD/BRL rate. Let's assume 1 USD = 5.80 BRL for now or fetch it if possible.
    const USD_BRL_RATE = 5.80;

    useEffect(() => {
        const updateData = async () => {
            try {
                // Fetch BTC Price
                const price = await fetchPrice('BTC');
                setBtcPrice(price);

                // Calculate Portfolio Value
                // Note: This is a simplified calculation assuming all holdings have a USDT pair
                // and we fetch them one by one. For a large portfolio, we'd need batch requests.
                let total = 0;
                for (const holding of holdings) {
                    if (holding.quantity > 0) {
                        const p = await fetchPrice(holding.symbol);
                        total += p * holding.quantity;
                    }
                }
                setPortfolioValue(total);
                setLoading(false);
            } catch (error) {
                console.error("Error updating dashboard", error);
                setLoading(false);
            }
        };

        updateData();
        const interval = setInterval(updateData, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, [holdings]);

    const formatCurrency = (value) => {
        const val = currency === 'BRL' ? value * USD_BRL_RATE : value;
        return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
            style: 'currency',
            currency: currency
        }).format(val);
    };

    return (
        <div className="dashboard">
            <header className="app-header">
                <div className="logo">CryptoFolio</div>
                <div className="currency-toggle">
                    <button
                        className={currency === 'USD' ? 'active' : ''}
                        onClick={() => setCurrency('USD')}
                    >
                        USD
                    </button>
                    <button
                        className={currency === 'BRL' ? 'active' : ''}
                        onClick={() => setCurrency('BRL')}
                    >
                        BRL
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="stats-grid">
                    <div className="stat-card glass-panel">
                        <span className="stat-label">Bitcoin Price</span>
                        <h2 className="stat-value">{loading ? '...' : formatCurrency(btcPrice)}</h2>
                    </div>
                    <div className="stat-card glass-panel highlight">
                        <span className="stat-label">Portfolio Value</span>
                        <h2 className="stat-value">{loading ? '...' : formatCurrency(portfolioValue)}</h2>
                    </div>
                </div>

                <div className="content-grid">
                    <div className="chart-section">
                        <PriceChart symbol="BTC" holdings={holdings} />
                    </div>
                    <div className="holdings-section">
                        <HoldingsForm />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
