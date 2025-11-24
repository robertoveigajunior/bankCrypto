import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchPrice, fetch24hChange } from '../services/api';
import { fetchNews, NewsItem } from '../services/newsService';
import PriceChart from './PriceChart';
import HoldingsForm from './HoldingsForm';
import InvestmentChat from './InvestmentChat';

const Dashboard: React.FC = () => {
    const { t } = useLanguage();
    const { holdings, currency, rate } = usePortfolio();
    const [btcPrice, setBtcPrice] = useState<number>(0);
    const [btcChange, setBtcChange] = useState<number>(0);
    const [portfolioValue, setPortfolioValue] = useState<number>(0);

    // Estado para notícias
    const [marketNews, setMarketNews] = useState<NewsItem[]>([]);

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

    useEffect(() => {
        // Função para atualizar as notícias
        const updateNews = () => {
            fetchNews(6).then(setMarketNews);
        };
        updateNews();
        const interval = setInterval(updateNews, 5 * 60 * 1000); // Atualiza a cada 5 minutos
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        const val = currency === 'BRL' ? value * rate : value;
        return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
            style: 'currency',
            currency: currency
        }).format(val);
    };

    return (
        <div className="dashboard">
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#fff' }}>{t.dashboard.title}</h1>
                <p style={{ margin: 0, color: '#8b949e', fontSize: '14px' }}>{t.dashboard.description}</p>
            </header>

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

                <div className="holdings-section" style={{ marginBottom: '24px' }}>
                    <HoldingsForm />
                </div>

                <div className="chart-section">
                    <PriceChart symbol="BTC" holdings={holdings} />
                    <div style={{ marginTop: '20px' }}>
                        <PriceChart type="portfolio" holdings={holdings} />
                    </div>
                </div>

                {/* Market News Card */}
                <div className="glass-panel" style={{ marginTop: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#00ff88', fontSize: '20px' }}>{t.dashboard.newsTitle}</h3>

                    {marketNews.length === 0 ? (
                        <div style={{ color: '#aaa', fontSize: 14 }}>{t.dashboard.noNews}</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {marketNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, background 0.2s'
                                    }}
                                    className="news-card"
                                >
                                    {news.imageurl && (
                                        <div style={{ height: '160px', overflow: 'hidden' }}>
                                            <img src={news.imageurl} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#888' }}>
                                            <span>{news.source}</span>
                                            <span>{new Date(news.published_on * 1000).toLocaleDateString()}</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.4', color: '#fff' }}>{news.title}</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#aaa', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {news.body}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="chat-section">
                    <InvestmentChat />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
