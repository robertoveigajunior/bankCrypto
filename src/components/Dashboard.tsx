import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { fetchPrice, fetch24hChange } from '../services/api';
import PriceChart from './PriceChart';
import HoldingsForm from './HoldingsForm';
import InvestmentChat from './InvestmentChat';

const Dashboard: React.FC = () => {
    const { holdings, currency, setCurrency } = usePortfolio();
    const [btcPrice, setBtcPrice] = useState<number>(0);
    const [btcChange, setBtcChange] = useState<number>(0);
    const [portfolioValue, setPortfolioValue] = useState<number>(0);

    // Exchange rate (mocked for simplicity if not fetching, but we can try to fetch or just use a fixed rate for demo)
    // In a real app, we'd fetch USD/BRL rate. Let's assume 1 USD = 5.80 BRL for now or fetch it if possible.
    const USD_BRL_RATE = 5.80;

    useEffect(() => {
        const updateData = async () => {
            try {
                // Fetch BTC Price
                const price = await fetchPrice('BTC');
                setBtcPrice(price);

                // Fetch BTC 24h Change
                const change = await fetch24hChange('BTC');
                setBtcChange(change);

                // BUG FIX: Explicitly handle empty holdings
                if (holdings.length === 0) {
                    setPortfolioValue(0);
                    return;
                }

                // Calculate Portfolio Value
                // Note: This is a simplified calculation assuming all holdings have a USDT pair
                // and we fetch them one by one. For a large portfolio, we'd need batch requests.
                let total = 0;
                for (const holding of holdings) {
                    if (parseFloat(holding.quantity as string) > 0) {
                        const p = await fetchPrice(holding.symbol);
                        total += p * parseFloat(holding.quantity as string);
                    }
                }
                setPortfolioValue(total);
            } catch (error) {
                console.error("Error updating dashboard", error);
            }
        };

        updateData();
        const interval = setInterval(updateData, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, [holdings]);

    const formatCurrency = (value: number) => {
        const val = currency === 'BRL' ? value * USD_BRL_RATE : value;
        return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
            style: 'currency',
            currency: currency
        }).format(val);
    };

    return (
        <div className="dashboard">
            <div className="hacker-banner">
                <div className="logo" data-text="CryptoFolio">CryptoFolio</div>
            </div>
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

            <main className="main-content">
                <div className="stats-grid">
                    <div className="stat-card glass-panel">
                        <span className="stat-label">Bitcoin Price</span>
                        <h2 className="stat-value">{formatCurrency(btcPrice)}</h2>
                    </div>
                    <div className="stat-card glass-panel">
                        <span className="stat-label">24h Change (BTC)</span>
                        <h2 className={`stat-value ${btcChange >= 0 ? 'positive' : 'negative'}`}>
                            {btcChange > 0 ? '+' : ''}{btcChange.toFixed(2)}%
                        </h2>
                    </div>
                    <div className="stat-card glass-panel highlight">
                        <span className="stat-label">Portfolio Value</span>
                        <h2 className="stat-value">{formatCurrency(portfolioValue)}</h2>
                    </div>
                </div>

                <div className="content-grid">
                    <div className="chart-section">
                        <PriceChart symbol="BTC" holdings={holdings} />
                        <div style={{ marginTop: '20px' }}>
                            <PriceChart type="portfolio" holdings={holdings} />
                        </div>
                    </div>
                    <div className="holdings-section">
                        <HoldingsForm />
                    </div>
                </div>

                <div className="chat-section">
                    <InvestmentChat />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
