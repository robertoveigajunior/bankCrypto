import { fetchFearGreedIndex, getInvestmentRecommendation, getSentimentInfo } from './marketSentiment';
import { fetchPrice, fetch24hChange } from './api';
import { fetchNews } from './newsService';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
}

// Respostas criativas para interações humanas
const casualResponses = [
    { pattern: /obrigado|valeu|thanks|thank you/i, reply: () => [
        'De nada! 😊 Se precisar de mais alguma coisa, é só perguntar.',
        'Sempre à disposição! 🚀',
        'Conte comigo para suas dúvidas de cripto!'
    ][Math.floor(Math.random()*3)] },
    { pattern: /bom dia/i, reply: () => 'Bom dia! Que seu portfólio só cresça hoje! ☀️' },
    { pattern: /boa tarde/i, reply: () => 'Boa tarde! Pronto para acompanhar o mercado?' },
    { pattern: /boa noite/i, reply: () => 'Boa noite! Lembre-se: paciência é uma virtude no mundo cripto. 🌙' },
    { pattern: /oi|olá|hello|hi/i, reply: () => 'Olá! Como posso ajudar você no universo das criptos?' },
    { pattern: /tchau|até logo|bye/i, reply: () => 'Até mais! Volte sempre para dicas e análises.' },
];

/**
 * Generate AI response based on user question and market data
 */
export const generateChatResponse = async (userMessage: string, t?: any): Promise<string> => {
    const message = userMessage.toLowerCase().trim();

    // Resposta casual se detectar interação humana
    for (const c of casualResponses) {
        if (c.pattern.test(userMessage)) {
            return c.reply();
        }
    }

    try {
        // Fetch market sentiment
        const sentiment = await fetchFearGreedIndex();
        const sentimentInfo = getSentimentInfo(sentiment.value, t);

        // Detect cryptocurrency mentioned (default to BTC)
        let crypto = 'BTC';
        if (message.includes('eth') || message.includes('ethereum')) {
            crypto = 'ETH';
        } else if (message.includes('bnb') || message.includes('binance')) {
            crypto = 'BNB';
        } else if (message.includes('sol') || message.includes('solana')) {
            crypto = 'SOL';
        } else if (message.includes('ada') || message.includes('cardano')) {
            crypto = 'ADA';
        } else if (message.includes('xrp') || message.includes('ripple')) {
            crypto = 'XRP';
        }

        // Question about investing/buying
        if (message.includes('invest') || message.includes('buy') || message.includes('should i') ||
            message.includes('good time') || message.includes('now') ||
            message.includes('investir') || message.includes('comprar') || message.includes('devo')) {
            return getInvestmentRecommendation(sentiment, crypto, t);
        }

        // Question about market sentiment
        if (message.includes('sentiment') || message.includes('market') || message.includes('fear') ||
            message.includes('greed') || message.includes('how') && message.includes('market') ||
            message.includes('sentimento') || message.includes('mercado') || message.includes('medo') ||
            message.includes('ganância')) {
            if (t) {
                let resp = t.responses.marketSentiment(sentimentInfo.label, sentiment.value, sentimentInfo.description);
                const news = await fetchNews(crypto);
                if (news.length) {
                    resp += `\n\n${t.responses.newsBlock(news)}`;
                }
                return resp;
            }
            let resp = `${sentimentInfo.emoji} **Current Market Sentiment**\n\n` +
                `The crypto market is currently showing **${sentimentInfo.label}** (${sentiment.value}/100).\n\n` +
                `${sentimentInfo.description}\n\n` +
                `This index is based on volatility, market momentum, social media sentiment, and trading volume.`;
            const news = await fetchNews(crypto);
            if (news.length) {
                resp += `\n\n${t.responses.newsBlock(news)}`;
            }
            return resp;
        }

        // Question about price
        if (message.includes('price') || message.includes('cost') || message.includes('worth') ||
            message.includes('preço') || message.includes('custo') || message.includes('valor')) {
            try {
                const price = await fetchPrice(crypto);
                const change = await fetch24hChange(crypto);
                const priceFormatted = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                if (t) {
                    let resp = t.responses.priceInfo(crypto, priceFormatted, change, sentimentInfo.label, sentiment.value, sentimentInfo.description);
                    const news = await fetchNews(crypto);
                    if (news.length) {
                        resp += `\n\n${t.responses.newsBlock(news)}`;
                    }
                    return resp;
                }

                const changeEmoji = change >= 0 ? '📈' : '📉';
                let resp = `${changeEmoji} **${crypto} Current Price**\n\n` +
                    `**Price**: $${priceFormatted}\n` +
                    `**24h Change**: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%\n\n` +
                    `**Market Sentiment**: ${sentimentInfo.label} (${sentiment.value}/100)\n` +
                    `${sentimentInfo.description}`;
                const news = await fetchNews(crypto);
                if (news.length) {
                    resp += `\n\n${t.responses.newsBlock(news)}`;
                }
                return resp;
            } catch (error) {
                if (t) {
                    return t.responses.priceError(crypto);
                }
                return `I couldn't fetch the current ${crypto} price. Please try again.`;
            }
        }

        // Question about selling
        if (message.includes('sell') || message.includes('take profit') || message.includes('exit') ||
            message.includes('vender') || message.includes('realizar') || message.includes('lucro')) {
            if (sentiment.value >= 70) {
                if (t) {
                    return t.responses.sellGreed(sentiment.value, sentimentInfo.label);
                }
                return `${sentimentInfo.emoji} **Consider Taking Profits**\n\n` +
                    `Market sentiment is at ${sentiment.value}/100 (${sentimentInfo.label}).\n\n` +
                    `💡 This is typically a good time to take some profits off the table.\n\n` +
                    `📊 **Strategy**: Consider selling 20-30% of your position to secure gains while keeping exposure for potential upside.`;
            } else {
                if (t) {
                    return t.responses.sellHold(sentiment.value, sentimentInfo.label);
                }
                return `${sentimentInfo.emoji} **Hold Your Position**\n\n` +
                    `Market sentiment is at ${sentiment.value}/100 (${sentimentInfo.label}).\n\n` +
                    `💡 It might be too early to sell. Consider holding unless you need the funds.\n\n` +
                    `📊 **Strategy**: Set a target price and wait for greed signals before selling.`;
            }
        }

        // Question about strategy
        if (message.includes('strategy') || message.includes('plan') || message.includes('approach') ||
            message.includes('estratégia') || message.includes('plano') || message.includes('abordagem')) {
            if (t) {
                if (sentiment.value <= 40) {
                    return t.responses.strategyAccumulation(sentimentInfo.label, sentiment.value);
                } else if (sentiment.value <= 60) {
                    return t.responses.strategyNeutral(sentimentInfo.label, sentiment.value);
                } else {
                    return t.responses.strategyDistribution(sentimentInfo.label, sentiment.value);
                }
            }

            return `📊 **Investment Strategy Based on Current Market**\n\n` +
                `**Sentiment**: ${sentimentInfo.label} (${sentiment.value}/100)\n\n` +
                `**Recommended Approach**:\n` +
                (sentiment.value <= 40
                    ? `• 🟢 **Accumulation Phase**: DCA into positions\n• Set buy orders at support levels\n• Build long-term holdings\n• Keep some cash for further dips`
                    : sentiment.value <= 60
                        ? `• 🟡 **Neutral Phase**: Monitor closely\n• Avoid FOMO\n• Wait for clear signals\n• Maintain current positions`
                        : `• 🔴 **Distribution Phase**: Take profits gradually\n• Set stop-losses\n• Reduce exposure\n• Wait for better entry points`
                );
        }

        // Default response with general advice
        if (t) {
            return t.responses.default(sentimentInfo.label, sentiment.value);
        }

        let resp = `👋 **Hi! I'm your crypto investment advisor.**\n\n` +
            `**Current Market**: ${sentimentInfo.label} (${sentiment.value}/100) ${sentimentInfo.emoji}\n\n` +
            `I can help you with:\n` +
            `• Investment timing for BTC, ETH, and other cryptos\n` +
            `• Market sentiment analysis\n` +
            `• Price information\n` +
            `• Trading strategies\n\n` +
            `Try asking: "Should I invest in BTC now?" or "What's the current market sentiment?"`;
        const news = await fetchNews(crypto);
        if (news.length) {
            resp += `\n\n${t.responses.newsBlock(news)}`;
        }
        return resp;

    } catch (error) {
        console.error('Error generating chat response:', error);
        if (t) {
            return t.responses.generalError;
        }
        return `I'm having trouble analyzing the market right now. Please try again in a moment.`;
    }
};

/**
 * Create a new chat message
 */
export const createMessage = (text: string, sender: 'user' | 'bot'): ChatMessage => {
    return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        sender,
        timestamp: Date.now()
    };
};
