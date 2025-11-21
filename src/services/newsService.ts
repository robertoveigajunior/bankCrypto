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

const symbolToId: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    SOL: 'solana',
    ADA: 'cardano',
    XRP: 'ripple',
};

export const fetchNews = async (symbol: string, limit = 3): Promise<NewsItem[]> => {
    const id = symbolToId[symbol.toUpperCase()];
    if (!id) return [];
    try {
        const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/status_updates?per_page=${limit}`);
        if (!resp.ok) return [];
        const data = await resp.json();
        const updates = data.status_updates || [];
        return updates.slice(0, limit).map((u: any) => ({
            title: u.title,
            url: u.url,
            date: u.created_at,
        }));
    } catch (e) {
        console.error('Error fetching news from Coingecko', e);
        return [];
    }
};
