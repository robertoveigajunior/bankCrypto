import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import PriceChart from './PriceChart';
import { fetchHistory } from '../services/api';
import React from 'react';

vi.mock('../services/api');
vi.mock('react-chartjs-2', () => ({
    Line: () => <div data-testid="line-chart">Line Chart</div>
}));

describe('PriceChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (fetchHistory as Mock).mockResolvedValue([
            { time: 1620000000000, price: 50000 },
            { time: 1620086400000, price: 51000 }
        ]);
    });

    it('should render chart container', () => {
        render(<PriceChart symbol="BTC" />);
        expect(screen.getByText('Price History')).toBeInTheDocument();
        expect(screen.getByText('1 Week')).toBeInTheDocument();
        expect(screen.getByText('1 Month')).toBeInTheDocument();
    });

    it('should fetch history and render chart', async () => {
        render(<PriceChart symbol="BTC" />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });
        expect(fetchHistory).toHaveBeenCalledWith('BTC', '1d', 30);
    });

    it('should switch timeframe', async () => {
        render(<PriceChart symbol="BTC" />);

        const weekButton = screen.getByText('1 Week');
        weekButton.click();

        await waitFor(() => {
            expect(fetchHistory).toHaveBeenCalledWith('BTC', '4h', 42);
        });
    });

    it('should switch back to 1 Month', async () => {
        render(<PriceChart symbol="BTC" />);

        const monthButton = screen.getByText('1 Month');
        monthButton.click();

        await waitFor(() => {
            expect(fetchHistory).toHaveBeenCalledWith('BTC', '1d', 30);
        });
    });

    it('should render chart with multiple holdings', async () => {
        const holdings = [
            { symbol: 'BTC', quantity: 1 },
            { symbol: 'ETH', quantity: 10 }
        ];
        (fetchHistory as Mock).mockResolvedValue([
            { time: 1620000000000, price: 50000 },
            { time: 1620086400000, price: 51000 }
        ]);

        render(<PriceChart symbol="BTC" holdings={holdings} />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });
        expect(fetchHistory).toHaveBeenCalledWith('BTC', '1d', 30);
        expect(fetchHistory).toHaveBeenCalledWith('ETH', '1d', 30);
    });

    it('should render portfolio chart with aggregated value', async () => {
        const holdings = [
            { symbol: 'BTC', quantity: 1 },
            { symbol: 'ETH', quantity: 10 }
        ];
        (fetchHistory as Mock).mockResolvedValue([
            { time: 1620000000000, price: 50000 },
            { time: 1620086400000, price: 51000 }
        ]);

        render(<PriceChart type="portfolio" holdings={holdings} />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
            expect(screen.getByText('Portfolio Value History')).toBeInTheDocument();
        });

        // Should fetch history for all assets
        expect(fetchHistory).toHaveBeenCalledWith('BTC', '1d', 30);
        expect(fetchHistory).toHaveBeenCalledWith('ETH', '1d', 30);
    });

    it('should handle fetch error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (fetchHistory as Mock).mockRejectedValue(new Error('Fetch failed'));

        render(<PriceChart symbol="BTC" />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load chart data', expect.any(Error));
        });
        consoleSpy.mockRestore();
    });
});

