import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import HoldingsForm from './HoldingsForm';
import { usePortfolio } from '../context/PortfolioContext';
import React from 'react';

vi.mock('../context/PortfolioContext');

describe('HoldingsForm', () => {
    const mockAddHolding = vi.fn();
    const mockHoldings = [
        { symbol: 'BTC', quantity: 1 },
        { symbol: 'ETH', quantity: 10 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (usePortfolio as Mock).mockReturnValue({
            holdings: mockHoldings,
            addHolding: mockAddHolding,
            removeHolding: vi.fn(),
            updateHolding: vi.fn()
        });
    });

    it('should render form elements', () => {
        render(<HoldingsForm />);
        expect(screen.getByPlaceholderText('BTC')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
        expect(screen.getByText('Add Asset')).toBeInTheDocument();
    });

    it('should add a holding', () => {
        render(<HoldingsForm />);

        fireEvent.change(screen.getByPlaceholderText('BTC'), { target: { value: 'DOGE' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
        fireEvent.click(screen.getByText('Add Asset'));

        expect(mockAddHolding).toHaveBeenCalledWith('DOGE', '1000');
    });

    it('should display current holdings', () => {
        render(<HoldingsForm />);
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
});
