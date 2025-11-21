import { Translation } from './en';

export const zhCN: Translation = {
    // Language names
    languages: {
        en: 'English',
        'pt-BR': 'Português',
        'zh-CN': '中文'
    },

    // Chat UI
    chat: {
        title: '投资顾问',
        placeholder: '询问关于加密货币投资...',
        sendButton: '发送',
        typing: '输入中...'
    },

    // Sentiment labels
    sentiment: {
        extremeFear: '极度恐慌',
        fear: '恐慌',
        neutral: '中性',
        greed: '贪婪',
        extremeGreed: '极度贪婪'
    },

    // Sentiment descriptions
    sentimentDesc: {
        extremeFear: '市场处于极度恐慌状态。这可能是买入机会。',
        fear: '市场情绪恐慌。考虑积累仓位。',
        neutral: '市场情绪中性。等待更明确的信号。',
        greed: '市场贪婪。对新仓位要谨慎。',
        extremeGreed: '市场极度贪婪。考虑获利了结。'
    },

    // Chat responses
    responses: {
        welcome: "👋 你好！我是您的加密货币投资顾问。根据当前市场情绪，向我询问有关投资BTC、ETH或其他加密货币的问题！",

        // Investment recommendations
        extremeFearInvest: (value: number, crypto: string) =>
            `😱 **检测到极度恐慌** (${value}/100)\n\n` +
            `市场现在显示极度恐慌。从历史上看，这是**积累${crypto}**的好时机。\n\n` +
            `💡 **建议**：考虑对${crypto}进行定投（DCA）。恐慌往往带来买入机会。\n\n` +
            `⚠️ **风险**：市场可能进一步下跌。只投资您能承受损失的金额。`,

        fearInvest: (value: number, crypto: string) =>
            `😰 **市场恐慌** (${value}/100)\n\n` +
            `市场情绪恐慌。这可能是${crypto}的良好入场点。\n\n` +
            `💡 **建议**：逐步建仓。使用DCA策略平均您的入场价格。\n\n` +
            `📊 **策略**：设置价格提醒并在下跌时买入。`,

        neutralInvest: (value: number, crypto: string) =>
            `😐 **市场中性** (${value}/100)\n\n` +
            `市场情绪中性 - 既不恐慌也不贪婪。\n\n` +
            `💡 **建议**：在对${crypto}做出重大举动之前等待更明确的信号。\n\n` +
            `📊 **策略**：监控价格走势，等待恐慌（买入）或贪婪（卖出）信号。`,

        greedInvest: (value: number, crypto: string) =>
            `😊 **贪婪增长** (${value}/100)\n\n` +
            `市场显示贪婪。${crypto}可能过热。\n\n` +
            `💡 **建议**：对新仓位要谨慎。如果已经投资，考虑部分获利。\n\n` +
            `⚠️ **风险**：贪婪往往先于调整。不要因FOMO而建仓。`,

        extremeGreedInvest: (value: number, crypto: string) =>
            `🤑 **极度贪婪警报** (${value}/100)\n\n` +
            `市场处于极度贪婪区域。${crypto}可能即将调整。\n\n` +
            `💡 **建议**：如果有收益请**获利了结**。避免开新仓位。\n\n` +
            `📊 **策略**：设置止损以保护收益。等待市场降温后再买入。`,

        // Market sentiment
        marketSentiment: (label: string, value: number, description: string) =>
            `📊 **当前市场情绪**\n\n` +
            `加密货币市场目前显示**${label}** (${value}/100)。\n\n` +
            `${description}\n\n` +
            `该指数基于波动性、市场动量、社交媒体情绪和交易量。`,

        // Price info
        priceInfo: (crypto: string, price: string, change: number, label: string, value: number, description: string) =>
            `${change >= 0 ? '📈' : '📉'} **${crypto}当前价格**\n\n` +
            `**价格**: $${price}\n` +
            `**24小时变化**: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%\n\n` +
            `**市场情绪**: ${label} (${value}/100)\n` +
            `${description}`,

        // Selling advice
        sellGreed: (value: number, label: string) =>
            `🤑 **考虑获利了结**\n\n` +
            `市场情绪为${value}/100 (${label})。\n\n` +
            `💡 这通常是获利的好时机。\n\n` +
            `📊 **策略**：考虑卖出20-30%的仓位以确保收益，同时保持潜在上涨的敞口。`,

        sellHold: (value: number, label: string) =>
            `😐 **持有您的仓位**\n\n` +
            `市场情绪为${value}/100 (${label})。\n\n` +
            `💡 现在卖出可能太早。除非您需要资金，否则考虑持有。\n\n` +
            `📊 **策略**：设定目标价格，等待贪婪信号后再卖出。`,

        // Strategy
        strategyAccumulation: (label: string, value: number) =>
            `📊 **基于当前市场的投资策略**\n\n` +
            `**情绪**: ${label} (${value}/100)\n\n` +
            `**建议方法**:\n` +
            `• 🟢 **积累阶段**：定投建仓\n` +
            `• 在支撑位设置买单\n` +
            `• 建立长期持仓\n` +
            `• 保留一些现金以应对进一步下跌`,

        strategyNeutral: (label: string, value: number) =>
            `📊 **基于当前市场的投资策略**\n\n` +
            `**情绪**: ${label} (${value}/100)\n\n` +
            `**建议方法**:\n` +
            `• 🟡 **中性阶段**：密切监控\n` +
            `• 避免FOMO\n` +
            `• 等待明确信号\n` +
            `• 维持当前仓位`,

        strategyDistribution: (label: string, value: number) =>
            `📊 **基于当前市场的投资策略**\n\n` +
            `**情绪**: ${label} (${value}/100)\n\n` +
            `**建议方法**:\n` +
            `• 🔴 **分配阶段**：逐步获利\n` +
            `• 设置止损\n` +
            `• 减少敞口\n` +
            `• 等待更好的入场点`,

        // Default response
        default: (label: string, value: number) =>
            `👋 **你好！我是您的加密货币投资顾问。**\n\n` +
            `**当前市场**: ${label} (${value}/100)\n\n` +
            `我可以帮助您：\n` +
            `• BTC、ETH和其他加密货币的投资时机\n` +
            `• 市场情绪分析\n` +
            `• 价格信息\n` +
            `• 交易策略\n\n` +
            `试着问："我现在应该投资BTC吗？"或"当前市场情绪如何？"`,

        // Errors
        priceError: (crypto: string) => `无法获取${crypto}的当前价格。请重试。`,
        generalError: "我现在无法分析市场。请稍后再试。",
        chatError: "抱歉，我现在遇到问题。请重试。"
    }
};
