import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchPrice = async (symbol) => {
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

export const fetchHistory = async (symbol, interval = '1d', limit = 30) => {
  try {
    const response = await axios.get(`${BASE_URL}/klines`, {
      params: {
        symbol: symbol.toUpperCase() + 'USDT',
        interval: interval,
        limit: limit
      }
    });
    // Response format: [ [open time, open, high, low, close, volume, ...], ... ]
    return response.data.map(candle => ({
      time: candle[0],
      price: parseFloat(candle[4]) // Close price
    }));
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    throw error;
  }
};
