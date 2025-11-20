import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchPrice = async (symbol: string): Promise<number> => {
  try {
    // Binance API usually expects symbols like BTCUSDT
    const response = await axios.get(`${BASE_URL}/ticker/price`, {
      params: { symbol: symbol.toUpperCase() + 'USDT' }
    });
    return parseFloat(response.data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
};

interface CandleData {
  time: number;
  price: number;
}

export const fetchHistory = async (symbol: string, interval: string = '1d', limit: number = 30): Promise<CandleData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/klines`, {
      params: {
        symbol: symbol.toUpperCase() + 'USDT',
        interval: interval,
        limit: limit
      }
    });
    // Response format: [ [open time, open, high, low, close, volume, ...], ... ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((candle: any) => ({
      time: candle[0],
      price: parseFloat(candle[4]) // Close price
    }));
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    throw error;
  }
};

export const fetch24hChange = async (symbol: string): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/ticker/24hr`, {
      params: { symbol: symbol.toUpperCase() + 'USDT' }
    });
    return parseFloat(response.data.priceChangePercent);
  } catch (error) {
    console.error(`Error fetching 24h change for ${symbol}:`, error);
    throw error;
  }
};
