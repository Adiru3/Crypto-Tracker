// ===================================
// STOCKS API (Alpha Vantage) - FIXED
// ===================================

const STOCKS_CONFIG = {
    API_KEY: 'BS3RGPXPRZHPVZK0',
    BASE_URL: 'https://www.alphavantage.co/query',
    CACHE_KEY: 'stocks_data_cache',
    CACHE_DURATION: 600000, // 10 minutes
    POPULAR_STOCKS: [
        { symbol: 'AAPL', name: 'Apple Inc.', logo: '🍎' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', logo: '🪟' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', logo: '🔍' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: '📦' },
        { symbol: 'TSLA', name: 'Tesla Inc.', logo: '⚡' },
        { symbol: 'META', name: 'Meta Platforms Inc.', logo: '👤' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', logo: '🎮' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', logo: '🏦' },
        { symbol: 'V', name: 'Visa Inc.', logo: '💳' },
        { symbol: 'WMT', name: 'Walmart Inc.', logo: '🛒' },
        { symbol: 'DIS', name: 'The Walt Disney Company', logo: '🏰' },
        { symbol: 'NFLX', name: 'Netflix Inc.', logo: '🎬' },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.', logo: '💰' },
        { symbol: 'INTC', name: 'Intel Corporation', logo: '💻' },
        { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', logo: '⚙️' }
    ]
};

// Get cached stock data
function getStockCache() {
    try {
        const cached = localStorage.getItem(STOCKS_CONFIG.CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > STOCKS_CONFIG.CACHE_DURATION) {
            localStorage.removeItem(STOCKS_CONFIG.CACHE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

// Set stock cache
function setStockCache(data) {
    try {
        localStorage.setItem(STOCKS_CONFIG.CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.warn('Could not cache stocks data:', error);
    }
}

// Fetch all stocks - using mock data due to API limits
async function fetchAllStocks() {
    // Check cache first
    const cached = getStockCache();
    if (cached) {
        console.log('Loading stocks from cache...');
        return cached;
    }

    console.log('Using mock stock data (API limit protection)...');

    // Mock data - realistic stock prices
    const mockStocks = STOCKS_CONFIG.POPULAR_STOCKS.map((stock, index) => {
        const basePrice = 50 + Math.random() * 500;
        const change = (Math.random() - 0.5) * 20;
        const changePercent = (change / basePrice) * 100;

        return {
            ...stock,
            symbol: stock.symbol,
            name: stock.name,
            price: basePrice,
            current_price: basePrice,
            change: change,
            changePercent: changePercent,
            price_change_percentage_24h: changePercent,
            volume: Math.floor(Math.random() * 100000000),
            open: basePrice - change,
            high: basePrice + Math.abs(change) * 0.5,
            low: basePrice - Math.abs(change) * 0.5,
            market_cap: basePrice * 1000000000,
            image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='20' y='25' text-anchor='middle' font-size='20'>${stock.logo}</text></svg>`,
            type: 'stock'
        };
    });

    // Cache result
    setStockCache(mockStocks);

    return mockStocks;
}

// Fetch stock chart - mock data
async function fetchStockChart(symbol, days = 30) {
    const prices = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    let basePrice = 100 + Math.random() * 200;

    for (let i = days; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 10;
        basePrice += variation;
        prices.push([
            now - (i * dayMs),
            Math.max(10, basePrice)
        ]);
    }

    return prices;
}
