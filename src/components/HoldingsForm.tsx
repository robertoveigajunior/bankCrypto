import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const TOP_COINS = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'XRP' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'LINK', name: 'Chainlink' },
    { symbol: 'LTC', name: 'Litecoin' },
    { symbol: 'UNI', name: 'Uniswap' },
    { symbol: 'ATOM', name: 'Cosmos' },
    { symbol: 'ETC', name: 'Ethereum Classic' },
    { symbol: 'XLM', name: 'Stellar' },
    { symbol: 'BCH', name: 'Bitcoin Cash' },
    { symbol: 'ALGO', name: 'Algorand' },
    { symbol: 'VET', name: 'VeChain' },
];

const HoldingsForm: React.FC = () => {
    const { addHolding, holdings, removeHolding } = usePortfolio();
    const [symbol, setSymbol] = useState<string>('BTC');
    const [quantity, setQuantity] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (symbol && quantity) {
            addHolding(symbol.toUpperCase(), quantity);
            setQuantity('');
        }
    };

    const getIconUrl = (sym: string) =>
        `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${sym.toLowerCase()}.png`;

    return (
        <div className="holdings-container glass-panel">
            <h3>Manage Portfolio</h3>

            <form onSubmit={handleSubmit} className="holdings-form">
                <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
                    <label>Symbol</label>
                    <div
                        className="coin-selector-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img
                            src={getIconUrl(symbol)}
                            alt={symbol}
                            className="coin-icon-small"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <span>{symbol}</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>

                    {isOpen && (
                        <div className="coin-dropdown">
                            {TOP_COINS.map((coin) => (
                                <div
                                    key={coin.symbol}
                                    className="coin-option"
                                    onClick={() => {
                                        setSymbol(coin.symbol);
                                        setIsOpen(false);
                                    }}
                                >
                                    <img
                                        src={getIconUrl(coin.symbol)}
                                        alt={coin.symbol}
                                        className="coin-icon"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                    />
                                    <div className="coin-info">
                                        <span className="coin-symbol">{coin.symbol}</span>
                                        <span className="coin-name">{coin.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        step="any"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">Add Asset</button>
            </form>

            <div className="holdings-list">
                <h4>Your Assets</h4>
                {holdings.length === 0 ? (
                    <p className="empty-state">No assets added yet.</p>
                ) : (
                    <ul>
                        {holdings.map((h, index) => (
                            <li key={index} className="holding-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={getIconUrl(h.symbol)}
                                        alt={h.symbol}
                                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                    />
                                    <span className="holding-symbol">{h.symbol}</span>
                                </div>
                                <span className="holding-qty">{h.quantity}</span>
                                <button
                                    className="btn-delete"
                                    onClick={() => removeHolding(h.symbol)}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HoldingsForm;
