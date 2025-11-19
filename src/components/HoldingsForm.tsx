import React, { useState, FormEvent } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const HoldingsForm: React.FC = () => {
    const { addHolding, holdings, removeHolding } = usePortfolio();
    const [symbol, setSymbol] = useState<string>('BTC');
    const [quantity, setQuantity] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (symbol && quantity) {
            addHolding(symbol.toUpperCase(), quantity);
            setQuantity('');
        }
    };

    return (
        <div className="holdings-container glass-panel">
            <h3>Manage Portfolio</h3>

            <form onSubmit={handleSubmit} className="holdings-form">
                <div className="form-group">
                    <label>Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="BTC"
                        required
                    />
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
                                <span className="holding-symbol">{h.symbol}</span>
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
