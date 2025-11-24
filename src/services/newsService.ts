// src/services/newsService.ts

export interface NewsItem {
    id: string;
    title: string;
    url: string;
    body: string;
    imageurl: string;
    source: string;
    published_on: number; // timestamp
}

export const fetchNews = async (limit = 10): Promise<NewsItem[]> => {
    try {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await response.json();

        if (data.Type !== 100 || !data.Data) {
            throw new Error('Invalid response from CryptoCompare');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.Data.slice(0, limit).map((item: any) => ({
            id: item.id,
            title: item.title,
            url: item.url,
            body: item.body,
            imageurl: item.imageurl,
            source: item.source_info.name,
            published_on: item.published_on
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};
