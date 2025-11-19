import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Holding {
    symbol: string;
    quantity: number | string;
}

interface PortfolioContextType {
    holdings: Holding[];
    addHolding: (symbol: string, quantity: number | string) => void;
    updateHolding: (symbol: string, quantity: number | string) => void;
    removeHolding: (symbol: string) => void;
    currency: string;
    setCurrency: (currency: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};

interface PortfolioProviderProps {
    children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
    const [holdings, setHoldings] = useState<Holding[]>(() => {
        const saved = localStorage.getItem('cryptoPortfolio');
        return saved ? JSON.parse(saved) : [{ symbol: 'BTC', quantity: 0 }];
    });

    const [currency, setCurrency] = useState<string>('USD'); // USD or BRL

    useEffect(() => {
        localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings));
    }, [holdings]);

    const addHolding = (symbol: string, quantity: number | string) => {
        setHoldings(prev => {
            const existing = prev.find(h => h.symbol === symbol);
            if (existing) {
                return prev.map(h =>
                    h.symbol === symbol ? { ...h, quantity: parseFloat(h.quantity as string) + parseFloat(quantity as string) } : h
                );
            }
            return [...prev, { symbol, quantity: parseFloat(quantity as string) }];
        });
    };

    const updateHolding = (symbol: string, quantity: number | string) => {
        setHoldings(prev => prev.map(h => h.symbol === symbol ? { ...h, quantity: parseFloat(quantity as string) } : h));
    };

    const removeHolding = (symbol: string) => {
        setHoldings(prev => prev.filter(h => h.symbol !== symbol));
    };

    return (
        <PortfolioContext.Provider value={{ holdings, addHolding, updateHolding, removeHolding, currency, setCurrency }}>
            {children}
        </PortfolioContext.Provider>
    );
};
