export const en = {
    // Language names
    languages: {
        en: 'English',
        'pt-BR': 'Português'
    },

    // Chat UI
    chat: {
        title: 'Investment Advisor',
        placeholder: 'Ask about investing in crypto...',
        sendButton: 'Send',
        typing: 'Typing...'
    },

    // Sentiment labels
    sentiment: {
        extremeFear: 'Extreme Fear',
        fear: 'Fear',
        neutral: 'Neutral',
        greed: 'Greed',
        extremeGreed: 'Extreme Greed'
    },

    // Sentiment descriptions
    sentimentDesc: {
        extremeFear: 'Market is in extreme fear. This could be a buying opportunity.',
        fear: 'Market sentiment is fearful. Consider accumulating positions.',
        neutral: 'Market sentiment is neutral. Wait for clearer signals.',
        greed: 'Market is greedy. Be cautious with new positions.',
        extremeGreed: 'Market is in extreme greed. Consider taking profits.'
    },

    // Chat responses
    responses: {
        welcome: "👋 Hi! I'm your crypto investment advisor. Ask me about investing in BTC, ETH, or other cryptocurrencies based on current market sentiment!",

        // Investment recommendations
        extremeFearInvest: (value: number, crypto: string) =>
            `😱 **Extreme Fear Detected** (${value}/100)\n\n` +
            `The market is showing extreme fear right now. Historically, this has been a good time to **accumulate ${crypto}**.\n\n` +
            `💡 **Recommendation**: Consider dollar-cost averaging (DCA) into ${crypto}. Fear often presents buying opportunities.\n\n` +
            `⚠️ **Risk**: Market could drop further. Only invest what you can afford to lose.`,

        fearInvest: (value: number, crypto: string) =>
            `😰 **Fear in the Market** (${value}/100)\n\n` +
            `Market sentiment is fearful. This could be a good entry point for ${crypto}.\n\n` +
            `💡 **Recommendation**: Start building positions gradually. Use DCA strategy to average your entry price.\n\n` +
            `📊 **Strategy**: Set price alerts and buy on dips.`,

        neutralInvest: (value: number, crypto: string) =>
            `😐 **Neutral Market** (${value}/100)\n\n` +
            `Market sentiment is neutral - neither fearful nor greedy.\n\n` +
            `💡 **Recommendation**: Wait for clearer signals before making major moves in ${crypto}.\n\n` +
            `📊 **Strategy**: Monitor price action and wait for fear (buy) or greed (sell) signals.`,

        greedInvest: (value: number, crypto: string) =>
            `😊 **Greed Building** (${value}/100)\n\n` +
            `Market is showing greed. ${crypto} might be overheated.\n\n` +
            `💡 **Recommendation**: Be cautious with new positions. Consider taking partial profits if you're already invested.\n\n` +
            `⚠️ **Risk**: Greed often precedes corrections. Don't FOMO into positions.`,

        extremeGreedInvest: (value: number, crypto: string) =>
            `🤑 **Extreme Greed Alert** (${value}/100)\n\n` +
            `Market is in extreme greed territory. ${crypto} could be due for a correction.\n\n` +
            `💡 **Recommendation**: **Take profits** if you have gains. Avoid opening new positions.\n\n` +
            `📊 **Strategy**: Set stop-losses to protect gains. Wait for market cooldown before buying.`,

        // Market sentiment
        marketSentiment: (label: string, value: number, description: string) =>
            `📊 **Current Market Sentiment**\n\n` +
            `The crypto market is currently showing **${label}** (${value}/100).\n\n` +
            `${description}\n\n` +
            `This index is based on volatility, market momentum, social media sentiment, and trading volume.`,

        // Price info
        priceInfo: (crypto: string, price: string, change: number, label: string, value: number, description: string) =>
            `${change >= 0 ? '📈' : '📉'} **${crypto} Current Price**\n\n` +
            `**Price**: $${price}\n` +
            `**24h Change**: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%\n\n` +
            `**Market Sentiment**: ${label} (${value}/100)\n` +
            `${description}`,

        // Selling advice
        sellGreed: (value: number, label: string) =>
            `🤑 **Consider Taking Profits**\n\n` +
            `Market sentiment is at ${value}/100 (${label}).\n\n` +
            `💡 This is typically a good time to take some profits off the table.\n\n` +
            `📊 **Strategy**: Consider selling 20-30% of your position to secure gains while keeping exposure for potential upside.`,

        sellHold: (value: number, label: string) =>
            `😐 **Hold Your Position**\n\n` +
            `Market sentiment is at ${value}/100 (${label}).\n\n` +
            `💡 It might be too early to sell. Consider holding unless you need the funds.\n\n` +
            `📊 **Strategy**: Set a target price and wait for greed signals before selling.`,

        // Strategy
        strategyAccumulation: (label: string, value: number) =>
            `📊 **Investment Strategy Based on Current Market**\n\n` +
            `**Sentiment**: ${label} (${value}/100)\n\n` +
            `**Recommended Approach**:\n` +
            `• 🟢 **Accumulation Phase**: DCA into positions\n` +
            `• Set buy orders at support levels\n` +
            `• Build long-term holdings\n` +
            `• Keep some cash for further dips`,

        strategyNeutral: (label: string, value: number) =>
            `📊 **Investment Strategy Based on Current Market**\n\n` +
            `**Sentiment**: ${label} (${value}/100)\n\n` +
            `**Recommended Approach**:\n` +
            `• 🟡 **Neutral Phase**: Monitor closely\n` +
            `• Avoid FOMO\n` +
            `• Wait for clear signals\n` +
            `• Maintain current positions`,

        strategyDistribution: (label: string, value: number) =>
            `📊 **Investment Strategy Based on Current Market**\n\n` +
            `**Sentiment**: ${label} (${value}/100)\n\n` +
            `**Recommended Approach**:\n` +
            `• 🔴 **Distribution Phase**: Take profits gradually\n` +
            `• Set stop-losses\n` +
            `• Reduce exposure\n` +
            `• Wait for better entry points`,

        // Default response
        default: (label: string, value: number) =>
            `👋 **Hi! I'm your crypto investment advisor.**\n\n` +
            `**Current Market**: ${label} (${value}/100)\n\n` +
            `I can help you with:\n` +
            `• Investment timing for BTC, ETH, and other cryptos\n` +
            `• Market sentiment analysis\n` +
            `• Price information\n` +
            `• Trading strategies\n\n` +
            `Try asking: "Should I invest in BTC now?" or "What's the current market sentiment?"`,

        // Errors
        priceError: (crypto: string) => `I couldn't fetch the current ${crypto} price. Please try again.`,
        generalError: "I'm having trouble analyzing the market right now. Please try again in a moment.",
        chatError: "Sorry, I'm having trouble right now. Please try again."
    }
};

export type Translation = typeof en;
