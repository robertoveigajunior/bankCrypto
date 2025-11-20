import { describe, it, expect, vi, Mock } from 'vitest';
import axios from 'axios';
import { fetchPrice, fetchHistory, fetch24hChange } from './api';

vi.mock('axios');

describe('api service', () => {
    describe('fetchPrice', () => {
        it('should return the price for a given symbol', async () => {
            const mockPrice = 50000;
            (axios.get as Mock).mockResolvedValue({ data: { price: mockPrice.toString() } });

            const price = await fetchPrice('BTC');
            expect(price).toBe(mockPrice);
            expect(axios.get).toHaveBeenCalledWith('https://api.binance.com/api/v3/ticker/price', {
                params: { symbol: 'BTCUSDT' }
            });
        });

        it('should throw an error if the request fails', async () => {
            (axios.get as Mock).mockRejectedValue(new Error('Network Error'));
            await expect(fetchPrice('BTC')).rejects.toThrow('Network Error');
        });
    });

    describe('fetchHistory', () => {
        it('should return history data', async () => {
            const mockData = [
                [1620000000000, "50000", "51000", "49000", "50500", "100"],
                [1620086400000, "50500", "52000", "50000", "51500", "120"]
            ];
            (axios.get as Mock).mockResolvedValue({ data: mockData });

            const history = await fetchHistory('BTC');
            expect(history).toHaveLength(2);
            expect(history[0]).toEqual({ time: 1620000000000, price: 50500 });
            expect(history[1]).toEqual({ time: 1620086400000, price: 51500 });
        });

        it('should throw an error if the request fails', async () => {
            (axios.get as Mock).mockRejectedValue(new Error('Network Error'));
            await expect(fetchHistory('BTC')).rejects.toThrow('Network Error');
        });
    });

    describe('fetch24hChange', () => {
        it('should return 24h change percentage', async () => {
            const mockChange = 5.5;
            (axios.get as Mock).mockResolvedValue({ data: { priceChangePercent: mockChange.toString() } });

            const change = await fetch24hChange('BTC');
            expect(change).toBe(mockChange);
            expect(axios.get).toHaveBeenCalledWith('https://api.binance.com/api/v3/ticker/24hr', {
                params: { symbol: 'BTCUSDT' }
            });
        });

        it('should throw an error if the request fails', async () => {
            (axios.get as Mock).mockRejectedValue(new Error('Network Error'));
            await expect(fetch24hChange('BTC')).rejects.toThrow('Network Error');
        });
    });
});

