import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

const TestComponent = () => {
    const { holdings, addHolding, updateHolding, removeHolding, currency, setCurrency } = usePortfolio();
    return (
        <div>
            <div data-testid="currency">{currency}</div>
            <div data-testid="holdings-count">{holdings.length}</div>
            {holdings.map(h => (
                <div key={h.symbol} data-testid={`holding-${h.symbol}`}>
                    {h.symbol}: {h.quantity}
                </div>
            ))}
            <button onClick={() => addHolding('ETH', 10)}>Add ETH</button>
            <button onClick={() => updateHolding('BTC', 5)}>Update BTC</button>
            <button onClick={() => removeHolding('BTC')}>Remove BTC</button>
            <button onClick={() => setCurrency('BRL')}>Set BRL</button>
        </div>
    );
};

describe('PortfolioContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should provide default values', () => {
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        expect(screen.getByTestId('currency')).toHaveTextContent('USD');
        // Default is BTC: 0 if nothing in local storage
        expect(screen.getByTestId('holdings-count')).toHaveTextContent('1');
        expect(screen.getByTestId('holding-BTC')).toHaveTextContent('BTC: 0');
    });

    it('should add a holding', () => {
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        act(() => {
            screen.getByText('Add ETH').click();
        });

        expect(screen.getByTestId('holdings-count')).toHaveTextContent('2');
        expect(screen.getByTestId('holding-ETH')).toHaveTextContent('ETH: 10');
    });

    it('should update a holding', () => {
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        act(() => {
            screen.getByText('Update BTC').click();
        });

        expect(screen.getByTestId('holding-BTC')).toHaveTextContent('BTC: 5');
    });

    it('should remove a holding', () => {
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        act(() => {
            screen.getByText('Remove BTC').click();
        });

        expect(screen.getByTestId('holdings-count')).toHaveTextContent('0');
    });

    it('should change currency', () => {
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        act(() => {
            screen.getByText('Set BRL').click();
        });

        expect(screen.getByTestId('currency')).toHaveTextContent('BRL');
    });

    it('should load from localStorage', () => {
        localStorage.setItem('cryptoPortfolio', JSON.stringify([{ symbol: 'DOGE', quantity: 1000 }]));
        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        expect(screen.getByTestId('holdings-count')).toHaveTextContent('1');
        expect(screen.getByTestId('holding-DOGE')).toHaveTextContent('DOGE: 1000');
    });

    it('should throw error when used outside provider', () => {
        // Suppress console.error for this test as React logs the error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => render(<TestComponent />)).toThrow('usePortfolio must be used within a PortfolioProvider');

        consoleSpy.mockRestore();
    });
});
