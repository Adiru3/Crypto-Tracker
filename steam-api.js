// ===================================
// STEAM API - MOCK DATA (NO CORS API)
// ===================================

const STEAM_CONFIG = {
    CACHE_KEY: 'steam_data_cache',
    CACHE_DURATION: 600000, // 10 minutes
    POPULAR_ITEMS: [
        // CS2 Items
        { appid: 730, name: 'AK-47 | Redline (Field-Tested)', game: 'CS2', hash_name: 'AK-47 | Redline (Field-Tested)', rarity: 'Classified', emoji: '🔴' },
        { appid: 730, name: 'AWP | Asiimov (Field-Tested)', game: 'CS2', hash_name: 'AWP | Asiimov (Field-Tested)', rarity: 'Covert', emoji: '🎯' },
        { appid: 730, name: 'M4A4 | Howl (Factory New)', game: 'CS2', hash_name: 'M4A4 | Howl (Factory New)', rarity: 'Contraband', emoji: '🐺' },
        { appid: 730, name: 'Desert Eagle | Kumicho Dragon (Factory New)', game: 'CS2', hash_name: 'Desert Eagle | Kumicho Dragon (Factory New)', rarity: 'Covert', emoji: '🐉' },
        { appid: 730, name: 'Gut Knife | Doppler (Factory New)', game: 'CS2', hash_name: 'Gut Knife | Doppler (Factory New)', rarity: 'Knife', emoji: '🔪' },

        // Dota 2 Items
        { appid: 570, name: 'Dragonclaw Hook', game: 'Dota 2', hash_name: 'Dragonclaw Hook', rarity: 'Immortal', emoji: '🪝' },
        { appid: 570, name: 'Stache of the Spoils of War', game: 'Dota 2', hash_name: 'Stache of the Spoils of War', rarity: 'Immortal', emoji: '👔' },
        { appid: 570, name: 'Autographed Vigil Triumph', game: 'Dota 2', hash_name: 'Autographed Vigil Triumph', rarity: 'Immortal', emoji: '✍️' },

        // TF2 Items
        { appid: 440, name: 'Unusual Burning Flames Team Captain', game: 'TF2', hash_name: 'Unusual Burning Flames Team Captain', rarity: 'Unusual', emoji: '🔥' },
        { appid: 440, name: 'Golden Frying Pan', game: 'TF2', hash_name: 'Golden Frying Pan', rarity: 'Decorated', emoji: '🍳' },

        // Rust Items
        { appid: 252490, name: 'Metal Face Mask', game: 'Rust', hash_name: 'Metal Face Mask', rarity: 'Rare', emoji: '😷' },
        { appid: 252490, name: 'Hoodie', game: 'Rust', hash_name: 'Hoodie', rarity: 'Common', emoji: '👕' },
        { appid: 252490, name: 'AK47 | Tempered AK47', game: 'Rust', hash_name: 'AK47 | Tempered AK47', rarity: 'Legendary', emoji: '🔫' }
    ]
};

// Get cached steam data
function getSteamCache() {
    try {
        const cached = localStorage.getItem(STEAM_CONFIG.CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > STEAM_CONFIG.CACHE_DURATION) {
            localStorage.removeItem(STEAM_CONFIG.CACHE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

// Set steam cache
function setSteamCache(data) {
    try {
        localStorage.setItem(STEAM_CONFIG.CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.warn('Could not cache steam data:', error);
    }
}

// Generate realistic steam item prices
function generateSteamPrice(rarity) {
    const basePrice = {
        'Common': 0.5,
        'Rare': 3,
        'Classified': 15,
        'Covert': 50,
        'Knife': 200,
        'Immortal': 100,
        'Unusual': 500,
        'Legendary': 75,
        'Decorated': 3000,
        'Contraband': 15000
    };

    const base = basePrice[rarity] || 1;
    const variation = (Math.random() - 0.5) * base * 0.4;
    return base + variation;
}

// Fetch all steam items - mock data
async function fetchAllSteamItems() {
    // Check cache first
    const cached = getSteamCache();
    if (cached) {
        console.log('Loading Steam items from cache...');
        return cached;
    }

    console.log('Using mock Steam Market data...');

    const items = STEAM_CONFIG.POPULAR_ITEMS.map(item => {
        const price = generateSteamPrice(item.rarity);
        const change = (Math.random() - 0.5) * price * 0.3;
        const changePercent = (change / price) * 100;

        return {
            id: `${item.appid}-${item.hash_name}`,
            symbol: item.hash_name,
            name: item.name,
            game: item.game,
            appid: item.appid,
            hash_name: item.hash_name,
            rarity: item.rarity,
            price: price,
            current_price: price,
            change24h: change,
            changePercent: changePercent,
            price_change_percentage_24h: changePercent,
            volume: Math.floor(Math.random() * 10000),
            market_cap: price * Math.floor(Math.random() * 50000),
            high: price + Math.abs(change) * 0.5,
            low: price - Math.abs(change) * 0.5,
            image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='20' y='25' text-anchor='middle' font-size='20'>${item.emoji}</text></svg>`,
            type: 'steam'
        };
    });

    // Cache result
    setSteamCache(items);

    return items;
}

// Fetch steam item chart - mock data
async function fetchSteamItemChart(appid, hash_name, days = 30) {
    const prices = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Find the item to get base price
    const item = STEAM_CONFIG.POPULAR_ITEMS.find(i => i.appid === appid && i.hash_name === hash_name);
    let basePrice = item ? generateSteamPrice(item.rarity) : 10;

    for (let i = days; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * basePrice * 0.1;
        basePrice += variation;
        prices.push([
            now - (i * dayMs),
            Math.max(0.01, basePrice)
        ]);
    }

    return prices;
}
