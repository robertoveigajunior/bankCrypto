import axios from 'axios';

// Alternative.me Fear & Greed Index API (free, no API key required)
const FEAR_GREED_API = 'https://api.alternative.me/fng/';

export interface SentimentData {
    value: number; // 0-100 (0 = Extreme Fear, 100 = Extreme Greed)
    classification: string; // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
    timestamp: number;
}

// Cache to avoid excessive API calls
let cachedSentiment: SentimentData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch the current Fear & Greed Index from alternative.me
 */
export const fetchFearGreedIndex = async (): Promise<SentimentData> => {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedSentiment && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedSentiment;
    }

    try {
        const response = await axios.get(`${FEAR_GREED_API}?limit=1`);
        const data = response.data.data[0];

        const sentiment: SentimentData = {
            value: parseInt(data.value),
            classification: data.value_classification,
            timestamp: parseInt(data.timestamp) * 1000
        };

        // Update cache
        cachedSentiment = sentiment;
        lastFetchTime = now;

        return sentiment;
    } catch (error) {
        console.error('Error fetching Fear & Greed Index:', error);

        // Return neutral sentiment as fallback
        return {
            value: 50,
            classification: 'Neutral',
            timestamp: now
        };
    }
};

/**
 * Get sentiment interpretation and color
 */
export const getSentimentInfo = (value: number, t?: any): {
    label: string;
    color: string;
    emoji: string;
    description: string;
} => {
    if (value <= 20) {
        return {
            label: t ? t.sentiment.extremeFear : 'Extreme Fear',
            color: '#ff4444',
            emoji: '😱',
            description: t ? t.sentimentDesc.extremeFear : 'Market is in extreme fear. This could be a buying opportunity.'
        };
    } else if (value <= 40) {
        return {
            label: t ? t.sentiment.fear : 'Fear',
            color: '#ff8844',
            emoji: '😰',
            description: t ? t.sentimentDesc.fear : 'Market sentiment is fearful. Consider accumulating positions.'
        };
    } else if (value <= 60) {
        return {
            label: t ? t.sentiment.neutral : 'Neutral',
            color: '#ffbb44',
            emoji: '😐',
            description: t ? t.sentimentDesc.neutral : 'Market sentiment is neutral. Wait for clearer signals.'
        };
    } else if (value <= 80) {
        return {
            label: t ? t.sentiment.greed : 'Greed',
            color: '#88ff44',
            emoji: '😊',
            description: t ? t.sentimentDesc.greed : 'Market is greedy. Be cautious with new positions.'
        };
    } else {
        return {
            label: t ? t.sentiment.extremeGreed : 'Extreme Greed',
            color: '#44ff44',
            emoji: '🤑',
            description: t ? t.sentimentDesc.extremeGreed : 'Market is in extreme greed. Consider taking profits.'
        };
    }
};

/**
 * Get investment recommendation based on sentiment
 */
export const getInvestmentRecommendation = (sentiment: SentimentData, crypto: string = 'BTC', t?: any): string => {
    const { value } = sentiment;
    const info = getSentimentInfo(value, t);

    if (!t) {
        // Fallback to English if no translation provided
        if (value <= 25) {
            return `${info.emoji} **Extreme Fear Detected** (${value}/100)\n\n` +
                `The market is showing extreme fear right now. Historically, this has been a good time to **accumulate ${crypto}**.\n\n` +
                `💡 **Recommendation**: Consider dollar-cost averaging (DCA) into ${crypto}. Fear often presents buying opportunities.\n\n` +
                `⚠️ **Risk**: Market could drop further. Only invest what you can afford to lose.`;
        } else if (value <= 45) {
            return `${info.emoji} **Fear in the Market** (${value}/100)\n\n` +
                `Market sentiment is fearful. This could be a good entry point for ${crypto}.\n\n` +
                `💡 **Recommendation**: Start building positions gradually. Use DCA strategy to average your entry price.\n\n` +
                `📊 **Strategy**: Set price alerts and buy on dips.`;
        } else if (value <= 55) {
            return `${info.emoji} **Neutral Market** (${value}/100)\n\n` +
                `Market sentiment is neutral - neither fearful nor greedy.\n\n` +
                `💡 **Recommendation**: Wait for clearer signals before making major moves in ${crypto}.\n\n` +
                `📊 **Strategy**: Monitor price action and wait for fear (buy) or greed (sell) signals.`;
        } else if (value <= 75) {
            return `${info.emoji} **Greed Building** (${value}/100)\n\n` +
                `Market is showing greed. ${crypto} might be overheated.\n\n` +
                `💡 **Recommendation**: Be cautious with new positions. Consider taking partial profits if you're already invested.\n\n` +
                `⚠️ **Risk**: Greed often precedes corrections. Don't FOMO into positions.`;
        } else {
            return `${info.emoji} **Extreme Greed Alert** (${value}/100)\n\n` +
                `Market is in extreme greed territory. ${crypto} could be due for a correction.\n\n` +
                `💡 **Recommendation**: **Take profits** if you have gains. Avoid opening new positions.\n\n` +
                `📊 **Strategy**: Set stop-losses to protect gains. Wait for market cooldown before buying.`;
        }
    }

    // Use translations
    if (value <= 25) {
        return t.responses.extremeFearInvest(value, crypto);
    } else if (value <= 45) {
        return t.responses.fearInvest(value, crypto);
    } else if (value <= 55) {
        return t.responses.neutralInvest(value, crypto);
    } else if (value <= 75) {
        return t.responses.greedInvest(value, crypto);
    } else {
        return t.responses.extremeGreedInvest(value, crypto);
    }
};
