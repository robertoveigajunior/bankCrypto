// src/services/newsService.ts
/**
 * Simple wrapper around the free Coingecko status updates endpoint.
 * Returns an array of up to `limit` recent news items for a given cryptocurrency symbol.
 */
export interface NewsItem {
    title: string;
    url: string;
    date: string; // ISO string
}

// Função auxiliar para obter a API Key do localStorage (usada fora de componentes React)
function getApiKey() {
    return localStorage.getItem('coingeckoApiKey') || '';
}

const symbolToId: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    SOL: 'solana',
    ADA: 'cardano',
    XRP: 'ripple',
};

// Fallback: busca notícias do CryptoPanic se não houver notícias do Coingecko
async function fetchCryptoPanicNews(symbol: string, limit = 3): Promise<NewsItem[]> {
    // Mapeamento para nomes aceitos pelo CryptoPanic
    const symbolToName: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        XRP: 'ripple',
        BNB: 'binance-coin',
        SOL: 'solana',
        ADA: 'cardano',
    };
    const name = symbolToName[symbol.toUpperCase()];
    if (!name) return [];
    try {
        // Tenta buscar notícias por moeda
        let resp = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=demo&currencies=${symbol.toUpperCase()}&public=true`);
        let data = await resp.json();
        let results = (data.results || []).filter((item: any) => item.title && item.url);
        if (results.length === 0) {
            // Fallback: busca notícias gerais se não houver para a moeda
            resp = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true`);
            data = await resp.json();
            results = (data.results || []).filter((item: any) => item.title && item.url);
        }
        return results.slice(0, limit).map((item: any) => ({
            title: item.title,
            url: item.url,
            date: item.published_at,
        }));
    } catch (e) {
        console.error('Error fetching news from CryptoPanic', e);
        return [];
    }
}

export const fetchNews = async (symbol: string, limit = 3): Promise<NewsItem[]> => {
    const id = symbolToId[symbol.toUpperCase()];
    if (!id) return [];
    const apiKey = getApiKey();
    try {
        const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/status_updates?per_page=${limit}`, {
            headers: apiKey ? { 'x-cg-demo-api-key': apiKey } : {}
        });
        if (!resp.ok) throw new Error('Coingecko error');
        const data = await resp.json();
        const updates = data.status_updates || [];
        if (updates.length > 0) {
            return updates.slice(0, limit).map((u: any) => ({
                title: u.title,
                url: u.url,
                date: u.created_at,
            }));
        }
        // Se não houver notícias no Coingecko, busca no CryptoPanic
        return await fetchCryptoPanicNews(symbol, limit);
    } catch (e) {
        // Se der erro no Coingecko, tenta CryptoPanic
        return await fetchCryptoPanicNews(symbol, limit);
    }
};
