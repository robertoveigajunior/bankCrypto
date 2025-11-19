import React, { createContext, useState, useEffect, useContext } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
    const [holdings, setHoldings] = useState(() => {
        const saved = localStorage.getItem('cryptoPortfolio');
        return saved ? JSON.parse(saved) : [{ symbol: 'BTC', quantity: 0 }];
    });

    const [currency, setCurrency] = useState('USD'); // USD or BRL

    useEffect(() => {
        localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings));
    }, [holdings]);

    const addHolding = (symbol, quantity) => {
        setHoldings(prev => {
            const existing = prev.find(h => h.symbol === symbol);
            if (existing) {
                return prev.map(h =>
                    h.symbol === symbol ? { ...h, quantity: parseFloat(h.quantity) + parseFloat(quantity) } : h
                );
            }
            return [...prev, { symbol, quantity: parseFloat(quantity) }];
        });
    };

    const updateHolding = (symbol, quantity) => {
        setHoldings(prev => prev.map(h => h.symbol === symbol ? { ...h, quantity: parseFloat(quantity) } : h));
    };

    const removeHolding = (symbol) => {
        setHoldings(prev => prev.filter(h => h.symbol !== symbol));
    };

    return (
        <PortfolioContext.Provider value={{ holdings, addHolding, updateHolding, removeHolding, currency, setCurrency }}>
            {children}
        </PortfolioContext.Provider>
    );
};
