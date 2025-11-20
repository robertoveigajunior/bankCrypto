import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { usePortfolio } from '../context/PortfolioContext';
import { fetchPrice, fetch24hChange } from '../services/api';
import React from 'react';

// Mock dependencies
vi.mock('../context/PortfolioContext');
vi.mock('../services/api');
vi.mock('./PriceChart', () => ({
    default: ({ type }: { type?: string }) => <div data-testid="price-chart">{type === 'portfolio' ? 'Portfolio Chart' : 'Price Chart'}</div>
}));
vi.mock('./HoldingsForm', () => ({
    default: () => <div data-testid="holdings-form">HoldingsForm</div>
}));

describe('Dashboard', () => {
    const mockSetCurrency = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (usePortfolio as Mock).mockReturnValue({
            holdings: [{ symbol: 'BTC', quantity: 1 }],
            currency: 'USD',
            setCurrency: mockSetCurrency
        });
        (fetchPrice as Mock).mockResolvedValue(50000);
        (fetch24hChange as Mock).mockResolvedValue(2.5);
    });

    it('should render dashboard elements', async () => {
        render(<Dashboard />);

        expect(screen.getByText('Bank Crypto')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByText('BRL')).toBeInTheDocument();
        expect(screen.getAllByTestId('price-chart')).toHaveLength(2); // Two charts now
        expect(screen.getByTestId('holdings-form')).toBeInTheDocument();
    });

    it('should fetch and display prices and 24h change', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getAllByText(/\$50,000/)[0]).toBeInTheDocument(); // BTC Price
            expect(screen.getByText('+2.50%')).toBeInTheDocument(); // 24h Change
        });
    });

    it('should calculate portfolio value', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            // 1 BTC * 50000 = 50000
            // There are two stats with the same value, so getAllByText
            const values = screen.getAllByText(/\$50,000/);
            expect(values.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('should handle empty holdings', async () => {
        (usePortfolio as Mock).mockReturnValue({
            holdings: [],
            currency: 'USD',
            setCurrency: mockSetCurrency
        });

        render(<Dashboard />);

        await waitFor(() => {
            // Portfolio value should be 0
            expect(screen.getByText('$0.00')).toBeInTheDocument();
        });
    });

    it('should toggle currency', () => {
        render(<Dashboard />);

        screen.getByText('BRL').click();
        expect(mockSetCurrency).toHaveBeenCalledWith('BRL');
    });
});
