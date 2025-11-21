import { Translation } from './en';

export const ptBR: Translation = {
    // Language names
    languages: {
        en: 'English',
        'pt-BR': 'Português'
    },

    // Chat UI
    chat: {
        title: 'Consultor de Investimentos',
        placeholder: 'Pergunte sobre investir em cripto...',
        sendButton: 'Enviar',
        typing: 'Digitando...'
    },

    // Sentiment labels
    sentiment: {
        extremeFear: 'Medo Extremo',
        fear: 'Medo',
        neutral: 'Neutro',
        greed: 'Ganância',
        extremeGreed: 'Ganância Extrema'
    },

    // Sentiment descriptions
    sentimentDesc: {
        extremeFear: 'O mercado está em medo extremo. Esta pode ser uma oportunidade de compra.',
        fear: 'O sentimento do mercado está com medo. Considere acumular posições.',
        neutral: 'O sentimento do mercado está neutro. Aguarde sinais mais claros.',
        greed: 'O mercado está ganancioso. Seja cauteloso com novas posições.',
        extremeGreed: 'O mercado está em ganância extrema. Considere realizar lucros.'
    },

    // Chat responses
    responses: {
        welcome: "👋 Olá! Sou seu consultor de investimentos em cripto. Pergunte-me sobre investir em BTC, ETH ou outras criptomoedas com base no sentimento atual do mercado!",

        // Investment recommendations
        extremeFearInvest: (value: number, crypto: string) =>
            `😱 **Medo Extremo Detectado** (${value}/100)\n\n` +
            `O mercado está mostrando medo extremo agora. Historicamente, este tem sido um bom momento para **acumular ${crypto}**.\n\n` +
            `💡 **Recomendação**: Considere fazer aportes regulares (DCA) em ${crypto}. O medo frequentemente apresenta oportunidades de compra.\n\n` +
            `⚠️ **Risco**: O mercado pode cair ainda mais. Invista apenas o que você pode perder.`,

        fearInvest: (value: number, crypto: string) =>
            `😰 **Medo no Mercado** (${value}/100)\n\n` +
            `O sentimento do mercado está com medo. Este pode ser um bom ponto de entrada para ${crypto}.\n\n` +
            `💡 **Recomendação**: Comece a construir posições gradualmente. Use a estratégia DCA para fazer a média do seu preço de entrada.\n\n` +
            `📊 **Estratégia**: Configure alertas de preço e compre nas quedas.`,

        neutralInvest: (value: number, crypto: string) =>
            `😐 **Mercado Neutro** (${value}/100)\n\n` +
            `O sentimento do mercado está neutro - nem com medo nem ganancioso.\n\n` +
            `💡 **Recomendação**: Aguarde sinais mais claros antes de fazer grandes movimentos em ${crypto}.\n\n` +
            `📊 **Estratégia**: Monitore a ação do preço e aguarde sinais de medo (compra) ou ganância (venda).`,

        greedInvest: (value: number, crypto: string) =>
            `😊 **Ganância Crescendo** (${value}/100)\n\n` +
            `O mercado está mostrando ganância. ${crypto} pode estar superaquecido.\n\n` +
            `💡 **Recomendação**: Seja cauteloso com novas posições. Considere realizar lucros parciais se já estiver investido.\n\n` +
            `⚠️ **Risco**: A ganância frequentemente precede correções. Não entre em posições por FOMO.`,

        extremeGreedInvest: (value: number, crypto: string) =>
            `🤑 **Alerta de Ganância Extrema** (${value}/100)\n\n` +
            `O mercado está em território de ganância extrema. ${crypto} pode estar prestes a uma correção.\n\n` +
            `💡 **Recomendação**: **Realize lucros** se tiver ganhos. Evite abrir novas posições.\n\n` +
            `📊 **Estratégia**: Configure stop-loss para proteger ganhos. Aguarde o mercado esfriar antes de comprar.`,

        // Market sentiment
        marketSentiment: (label: string, value: number, description: string) =>
            `📊 **Sentimento Atual do Mercado**\n\n` +
            `O mercado de cripto está atualmente mostrando **${label}** (${value}/100).\n\n` +
            `${description}\n\n` +
            `Este índice é baseado em volatilidade, momentum do mercado, sentimento nas redes sociais e volume de negociação.`,

        // Price info
        priceInfo: (crypto: string, price: string, change: number, label: string, value: number, description: string) =>
            `${change >= 0 ? '📈' : '📉'} **Preço Atual do ${crypto}**\n\n` +
            `**Preço**: $${price}\n` +
            `**Variação 24h**: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%\n\n` +
            `**Sentimento do Mercado**: ${label} (${value}/100)\n` +
            `${description}`,

        newsBlock: (items: any[]) => {
            const lines = items.map(i => `• [${i.title}](${i.url})`).join('\n');
            return `📰 Notícias recentes:\n${lines}`;
        },
        // Selling advice
        sellGreed: (value: number, label: string) =>
            `🤑 **Considere Realizar Lucros**\n\n` +
            `O sentimento do mercado está em ${value}/100 (${label}).\n\n` +
            `💡 Este é tipicamente um bom momento para realizar alguns lucros.\n\n` +
            `📊 **Estratégia**: Considere vender 20-30% da sua posição para garantir ganhos enquanto mantém exposição para potencial alta.`,

        sellHold: (value: number, label: string) =>
            `😐 **Mantenha Sua Posição**\n\n` +
            `O sentimento do mercado está em ${value}/100 (${label}).\n\n` +
            `💡 Pode ser muito cedo para vender. Considere manter a menos que precise dos fundos.\n\n` +
            `📊 **Estratégia**: Defina um preço alvo e aguarde sinais de ganância antes de vender.`,

        // Strategy
        strategyAccumulation: (label: string, value: number) =>
            `📊 **Estratégia de Investimento Baseada no Mercado Atual**\n\n` +
            `**Sentimento**: ${label} (${value}/100)\n\n` +
            `**Abordagem Recomendada**:\n` +
            `• 🟢 **Fase de Acumulação**: DCA em posições\n` +
            `• Configure ordens de compra em níveis de suporte\n` +
            `• Construa posições de longo prazo\n` +
            `• Mantenha algum dinheiro para quedas adicionais`,

        strategyNeutral: (label: string, value: number) =>
            `📊 **Estratégia de Investimento Baseada no Mercado Atual**\n\n` +
            `**Sentimento**: ${label} (${value}/100)\n\n` +
            `**Abordagem Recomendada**:\n` +
            `• 🟡 **Fase Neutra**: Monitore de perto\n` +
            `• Evite FOMO\n` +
            `• Aguarde sinais claros\n` +
            `• Mantenha as posições atuais`,

        strategyDistribution: (label: string, value: number) =>
            `📊 **Estratégia de Investimento Baseada no Mercado Atual**\n\n` +
            `**Sentimento**: ${label} (${value}/100)\n\n` +
            `**Abordagem Recomendada**:\n` +
            `• 🔴 **Fase de Distribuição**: Realize lucros gradualmente\n` +
            `• Configure stop-loss\n` +
            `• Reduza a exposição\n` +
            `• Aguarde melhores pontos de entrada`,

        // Default response
        default: (label: string, value: number) =>
            `👋 **Olá! Sou seu consultor de investimentos em cripto.**\n\n` +
            `**Mercado Atual**: ${label} (${value}/100)\n\n` +
            `Posso ajudá-lo com:\n` +
            `• Momento de investimento para BTC, ETH e outras criptos\n` +
            `• Análise de sentimento do mercado\n` +
            `• Informações de preço\n` +
            `• Estratégias de negociação\n\n` +
            `Tente perguntar: "Devo investir em BTC agora?" ou "Qual é o sentimento atual do mercado?"`,

        // Errors
        priceError: (crypto: string) => `Não consegui buscar o preço atual do ${crypto}. Por favor, tente novamente.`,
        generalError: "Estou tendo problemas para analisar o mercado agora. Por favor, tente novamente em um momento.",
        chatError: "Desculpe, estou tendo problemas agora. Por favor, tente novamente."
    }
};
