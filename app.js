// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
    API_BASE_URL: 'https://api.coingecko.com/api/v3',
    COINS_PER_PAGE: 100, // Fetch top 100 coins
    TOTAL_PAGES: 1, // Load 1 page = 100 coins total
    PAGINATION_DELAY: 1500, // 1.5 seconds between page requests
    UPDATE_INTERVAL: 60000, // 60 seconds (1 minute)
    CHART_DAYS: 30,
    RATE_LIMIT_DELAY: 3000, // 3 seconds between API calls
    ENABLE_CHARTS: false, // Disable charts to avoid 429 errors
    CACHE_DURATION: 60000 // 60 seconds cache
};

// ===================================
// STATE MANAGEMENT
// ===================================
let state = {
    allAssets: [],
    filteredAssets: [],
    currentTab: 'crypto',
    currentFilter: 'all',
    searchQuery: '',
    isLoading: false,
    charts: new Map(),
    modalChart: null,
    currentDetailAsset: null
};

// ===================================
// DOM ELEMENTS
// ===================================
const elements = {
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    assetsGrid: document.getElementById('assetsGrid'),
    searchInput: document.getElementById('searchInput'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    retryBtn: document.getElementById('retryBtn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    langBtns: document.querySelectorAll('.lang-btn'),
    detailModal: document.getElementById('detailModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn')
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format price with proper currency symbol
function formatPrice(price) {
    if (price >= 1) {
        return new Intl.NumberFormat(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'ua' ? 'uk-UA' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    } else if (price >= 0.01) {
        return new Intl.NumberFormat(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'ua' ? 'uk-UA' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(price);
    } else {
        return new Intl.NumberFormat(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'ua' ? 'uk-UA' : 'en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 6,
            maximumFractionDigits: 8
        }).format(price);
    }
}

// Format large numbers (market cap, volume)
function formatLargeNumber(num) {
    if (num >= 1e12) {
        return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
}

// Format percentage change
function formatPercentage(percent) {
    if (percent === null || percent === undefined) return t('notAvailable');
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
}

// Delay function for rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================
// CACHING FUNCTIONS
// ===================================

// Get data from cache
function getCachedData(key) {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp > CONFIG.CACHE_DURATION) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

// Save data to cache
function setCachedData(key, data) {
    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

// ===================================
// API FUNCTIONS
// ===================================

// Fetch market data for top coins with pagination
async function fetchMarketData() {
    // Check cache first
    const cacheKey = 'crypto_market_data';
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Loading from cache...');
        return cached;
    }

    try {
        console.log(`Fetching ${CONFIG.COINS_PER_PAGE * CONFIG.TOTAL_PAGES} coins (${CONFIG.TOTAL_PAGES} pages)...`);
        let allCoins = [];

        // Fetch multiple pages
        for (let page = 1; page <= CONFIG.TOTAL_PAGES; page++) {
            console.log(`Loading page ${page}/${CONFIG.TOTAL_PAGES}...`);

            // Update loading text with progress
            if (elements.loadingState && elements.loadingState.querySelector('.loading-text')) {
                elements.loadingState.querySelector('.loading-text').textContent =
                    `Загрузка монет... ${page}/${CONFIG.TOTAL_PAGES}`;
            }

            const response = await fetch(
                `${CONFIG.API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${CONFIG.COINS_PER_PAGE}&page=${page}&sparkline=false&price_change_percentage=24h,7d,30d`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const pageData = await response.json();
            allCoins = [...allCoins, ...pageData];

            // Delay before next page to avoid rate limits
            if (page < CONFIG.TOTAL_PAGES) {
                console.log(`Waiting ${CONFIG.PAGINATION_DELAY}ms before next page...`);
                await delay(CONFIG.PAGINATION_DELAY);
            }
        }

        console.log(`Successfully loaded ${allCoins.length} coins`);
        const mappedData = allCoins.map(coin => ({ ...coin, type: 'crypto' }));

        // Save to cache
        setCachedData(cacheKey, mappedData);

        return mappedData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
}

// Fetch detailed coin data
async function fetchCoinDetails(coinId) {
    try {
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=true`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching details for ${coinId}:`, error);
        return null;
    }
}

// Fetch 30-day chart data for a specific coin
async function fetchChartData(coinId) {
    try {
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${CONFIG.CHART_DAYS}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.prices;
    } catch (error) {
        console.error(`Error fetching chart data for ${coinId}:`, error);
        return null;
    }
}

// ===================================
// CHART FUNCTIONS
// ===================================

// Create sparkline chart for an asset
function createChart(canvasId, prices, priceChange) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isPositive = priceChange >= 0;

    // Destroy existing chart if it exists
    if (state.charts.has(canvasId)) {
        state.charts.get(canvasId).destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isPositive) {
        gradient.addColorStop(0, 'rgba(56, 239, 125, 0.3)');
        gradient.addColorStop(1, 'rgba(56, 239, 125, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(255, 106, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 106, 0, 0)');
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map((_, i) => i),
            datasets: [{
                data: prices.map(p => p[1]),
                borderColor: isPositive ? '#38ef7d' : '#ff6a00',
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: isPositive ? '#38ef7d' : '#ff6a00',
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 39, 64, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return formatPrice(context.parsed.y);
                        },
                        title: function (context) {
                            const daysAgo = prices.length - context[0].dataIndex - 1;
                            return daysAgo === 0 ? t('today') : `${daysAgo} ${t('daysAgo')}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });

    state.charts.set(canvasId, chart);
}

// ===================================
// RECOMMENDATIONS
// ===================================

// Calculate recommendation score for crypto (MAXIMUM PROFIT POTENTIAL)
function getRecommendationScore(asset) {
    if (!asset || asset.type !== 'crypto') return 0;

    let score = 0;

    // === MOMENTUM ANALYSIS (40 points max) ===
    const change24h = asset.price_change_percentage_24h || 0;
    const change7d = asset.price_change_percentage_7d_in_currency || 0;
    const change30d = asset.price_change_percentage_30d_in_currency || 0;

    // Short-term momentum (24h)
    if (change24h > 10) score += 15;
    else if (change24h > 5) score += 10;
    else if (change24h > 2) score += 5;
    else if (change24h > 0) score += 2;
    else if (change24h < -10) score -= 5;

    // Medium-term trend (7d)
    if (change7d > 20) score += 12;
    else if (change7d > 10) score += 8;
    else if (change7d > 5) score += 4;
    else if (change7d < -20) score -= 3;

    // Long-term trend (30d)
    if (change30d > 50) score += 13;
    else if (change30d > 25) score += 8;
    else if (change30d > 10) score += 3;

    // === VOLUME ANALYSIS (25 points max) ===
    if (asset.total_volume && asset.market_cap) {
        const volumeRatio = asset.total_volume / asset.market_cap;
        if (volumeRatio > 0.5) score += 15;
        else if (volumeRatio > 0.3) score += 12;
        else if (volumeRatio > 0.15) score += 8;
        else if (volumeRatio > 0.05) score += 4;

        if (asset.total_volume > 1000000000) score += 10;
        else if (asset.total_volume > 100000000) score += 5;
    }

    // === MARKET POSITION (20 points max) ===
    if (asset.market_cap_rank) {
        if (asset.market_cap_rank <= 10) score += 10;
        else if (asset.market_cap_rank <= 30) score += 8;
        else if (asset.market_cap_rank <= 50) score += 6;
        else if (asset.market_cap_rank <= 100) score += 4;
        else if (asset.market_cap_rank <= 150) score += 2;

        // Mid-cap gems bonus
        if (asset.market_cap_rank > 50 && asset.market_cap_rank <= 150 && change24h > 5) {
            score += 10;
        }
    }

    // === PRICE LEVEL ANALYSIS (15 points max) ===
    const price = asset.current_price || 0;
    const ath = asset.ath || 0;

    if (ath > 0 && price > 0) {
        const distanceFromATH = ((ath - price) / ath) * 100;
        if (distanceFromATH > 70 && change24h > 0) score += 15;
        else if (distanceFromATH > 50 && change24h > 0) score += 10;
        else if (distanceFromATH > 30 && change24h > 0) score += 5;
        if (distanceFromATH < 5 && change24h > 3) score += 8;
    }

    // === PROFIT MULTIPLIER POTENTIAL ===
    if (price < 0.01 && (asset.total_volume || 0) > 10000000) score += 12;
    else if (price < 0.1 && (asset.total_volume || 0) > 50000000) score += 8;
    else if (price < 1 && (asset.total_volume || 0) > 100000000) score += 5;

    return Math.max(0, Math.min(100, score));
}

// ===================================
// FILTERING & SORTING
// ===================================

// Apply current filter and search
function applyFiltersAndSearch() {
    let filtered = state.allAssets.filter(asset => asset.type === state.currentTab);

    // Apply search
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(asset =>
            asset.name.toLowerCase().includes(query) ||
            (asset.symbol && asset.symbol.toLowerCase().includes(query))
        );
    }

    // Apply filter
    switch (state.currentFilter) {
        case 'top-gainers':
            filtered.sort((a, b) => {
                const aChange = a.price_change_percentage_24h || a.changePercent || a.change24h || 0;
                const bChange = b.price_change_percentage_24h || b.changePercent || b.change24h || 0;
                return bChange - aChange;
            });
            filtered = filtered.slice(0, 20);
            break;
        case 'top-losers':
            filtered.sort((a, b) => {
                const aChange = a.price_change_percentage_24h || a.changePercent || a.change24h || 0;
                const bChange = b.price_change_percentage_24h || b.changePercent || b.change24h || 0;
                return aChange - bChange;
            });
            filtered = filtered.slice(0, 20);
            break;
        case 'most-expensive':
            filtered.sort((a, b) => {
                const aPrice = a.current_price || a.price || 0;
                const bPrice = b.current_price || b.price || 0;
                return bPrice - aPrice;
            });
            filtered = filtered.slice(0, 20);
            break;
        case 'least-expensive':
            filtered.sort((a, b) => {
                const aPrice = a.current_price || a.price || 0;
                const bPrice = b.current_price || b.price || 0;
                return aPrice - bPrice;
            });
            filtered = filtered.slice(0, 20);
            break;
        case 'highest-mcap':
            filtered.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
            filtered = filtered.slice(0, 20);
            break;
        case 'recommended':
            // Add recommendation scores
            filtered = filtered.map(asset => ({
                ...asset,
                recommendationScore: getRecommendationScore(asset)
            }));
            filtered.sort((a, b) => b.recommendationScore - a.recommendationScore);
            filtered = filtered.slice(0, 20);
            break;
        case 'all':
        default:
            // Already sorted by market cap or keep original order
            break;
    }

    state.filteredAssets = filtered;
    renderAssets();
}

// ===================================
// RENDERING FUNCTIONS
// ===================================

// Show loading state
function showLoading() {
    elements.loadingState.style.display = 'flex';
    elements.errorState.style.display = 'none';
    elements.assetsGrid.style.display = 'none';
}

// Show error state
function showError() {
    elements.loadingState.style.display = 'none';
    elements.errorState.style.display = 'flex';
    elements.assetsGrid.style.display = 'none';
}

// Show assets grid
function showAssets() {
    elements.loadingState.style.display = 'none';
    elements.errorState.style.display = 'none';
    elements.assetsGrid.style.display = 'grid';
}

// Render asset card (works for crypto, stocks, steam)
function renderAssetCard(asset) {
    const changeValue = asset.price_change_percentage_24h || asset.changePercent || asset.change24h || 0;
    const changeClass = changeValue >= 0 ? 'positive' : 'negative';
    const canvasId = `chart-${asset.id || asset.symbol}`;
    const price = asset.current_price || asset.price || 0;
    const volume = asset.total_volume || asset.volume || 0;
    const mcap = asset.market_cap || 0;

    // Asset type specific rendering
    let typeSpecificContent = '';
    if (asset.type === 'crypto') {
        typeSpecificContent = `
            <div class="coin-rank">#${asset.market_cap_rank || 'N/A'}</div>
        `;
    } else if (asset.type === 'stock') {
        typeSpecificContent = `
            <div class="coin-symbol">${asset.symbol}</div>
        `;
    } else if (asset.type === 'steam') {
        typeSpecificContent = `
            <div class="coin-symbol">${asset.game}</div>
        `;
    }

    return `
        <div class="coin-card" data-asset-id="${asset.id || asset.symbol}" data-asset-type="${asset.type}">
            <div class="coin-header">
                ${asset.image ? `<img src="${asset.image}" alt="${asset.name}" class="coin-icon">` : '<div class="coin-icon" style="background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${asset.name[0]}</div>'}
                <div class="coin-info">
                    <div class="coin-name">${asset.name}</div>
                    ${asset.symbol ? `<div class="coin-symbol">${asset.symbol.toUpperCase()}</div>` : ''}
                </div>
                ${typeSpecificContent}
            </div>
            
            <div class="coin-price">${formatPrice(price)}</div>
            
            <div class="coin-change ${changeClass}">
                ${formatPercentage(changeValue)} ${t('change24h')}
            </div>
            
            <div class="coin-stats">
                <div class="stat-item">
                    <div class="stat-label">${asset.type === 'stock' ? t('openPrice') : t('marketCap')}</div>
                    <div class="stat-value">${asset.type === 'stock' && asset.open ? formatPrice(asset.open) : formatLargeNumber(mcap)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">${t('volume24h')}</div>
                    <div class="stat-value">${formatLargeNumber(volume)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">${t('high24h')}</div>
                    <div class="stat-value">${formatPrice(asset.high_24h || asset.high || price)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">${t('low24h')}</div>
                    <div class="stat-value">${formatPrice(asset.low_24h || asset.low || price)}</div>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="${canvasId}"></canvas>
            </div>
        </div>
    `;
}

// Render all assets
function renderAssets() {
    if (state.filteredAssets.length === 0) {
        elements.assetsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <div style="font-size: 1.25rem;">${t('noResults')}</div>
                <div style="font-size: 0.875rem; margin-top: 0.5rem;">${t('noResultsDesc')}</div>
            </div>
        `;
        showAssets();
        return;
    }

    elements.assetsGrid.innerHTML = state.filteredAssets.map(asset => renderAssetCard(asset)).join('');
    showAssets();

    // Add click listeners to cards
    document.querySelectorAll('.coin-card').forEach(card => {
        card.addEventListener('click', () => {
            const assetId = card.dataset.assetId;
            const assetType = card.dataset.assetType;
            const asset = state.allAssets.find(a => (a.id || a.symbol) === assetId && a.type === assetType);
            if (asset) {
                openDetailModal(asset);
            }
        });
    });

    // Load charts for visible assets
    loadChartsForVisibleAssets();
}

// Load charts for all visible assets
async function loadChartsForVisibleAssets() {
    // Disable charts if configured
    if (!CONFIG.ENABLE_CHARTS) {
        console.log('Charts disabled to save API calls');
        return;
    }

    const visibleAssets = state.filteredAssets.slice(0, 5); // Only 5 charts

    for (const asset of visibleAssets) {
        let chartData;

        if (asset.type === 'crypto') {
            chartData = await fetchChartData(asset.id);
        } else if (asset.type === 'stock' && typeof fetchStockChart !== 'undefined') {
            chartData = await fetchStockChart(asset.symbol, 30);
        }

        if (chartData) {
            const changeValue = asset.price_change_percentage_24h || asset.changePercent || asset.change24h || 0;
            createChart(`chart-${asset.id || asset.symbol}`, chartData, changeValue);
        }
        await delay(CONFIG.RATE_LIMIT_DELAY);
    }
}

// ===================================
// DETAILED MODAL
// ===================================

// Open detail modal
async function openDetailModal(asset) {
    state.currentDetailAsset = asset;
    elements.detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set basic info
    document.getElementById('modalIcon').src = asset.image || '';
    document.getElementById('modalTitle').textContent = asset.name;
    document.getElementById('modalSymbol').textContent = asset.symbol ? asset.symbol.toUpperCase() : '';
    document.getElementById('modalPrice').textContent = formatPrice(asset.current_price || asset.price || 0);

    // Load detailed data for crypto
    if (asset.type === 'crypto') {
        const details = await fetchCoinDetails(asset.id);
        if (details) {
            renderDetailedStats(details);
        }
    } else {
        renderDetailedStats(asset);
    }

    // Setup Share button for modal
    const modalShareBtn = document.getElementById('modalShareBtn');
    if (modalShareBtn) {
        modalShareBtn.onclick = () => shareCoin(asset.id || asset.symbol, asset.name);
    }

    // Load and render chart
    let chartData;
    if (asset.type === 'crypto') {
        chartData = await fetchChartData(asset.id);
    } else if (asset.type === 'stock' && typeof fetchStockChart !== 'undefined') {
        chartData = await fetchStockChart(asset.symbol, 30);
    } else if (asset.type === 'steam' && typeof fetchSteamItemChart !== 'undefined') {
        chartData = await fetchSteamItemChart(asset.appid, asset.hash_name, 30);
    }

    if (chartData) {
        renderModalChart(chartData, asset.price_change_percentage_24h || asset.changePercent || 0);
    }
}

// Close detail modal
function closeDetailModal() {
    elements.detailModal.classList.remove('active');
    document.body.style.overflow = '';
    state.currentDetailAsset = null;

    if (state.modalChart) {
        state.modalChart.destroy();
        state.modalChart = null;
    }
}

// Render detailed statistics
function renderDetailedStats(asset) {
    const statsGrid = document.querySelector('.modal-stats-grid');
    const description = document.getElementById('modalDescription');
    const links = document.getElementById('modalLinks');

    let statsHTML = '';

    if (asset.type === 'crypto' || (!asset.type && asset.market_data)) {
        const data = asset.market_data || asset;
        statsHTML = `
            <div class="stat-item">
                <div class="stat-label">${t('currentPrice')}</div>
                <div class="stat-value">${formatPrice(data.current_price?.usd || data.current_price || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('marketCap')}</div>
                <div class="stat-value">${formatLargeNumber(data.market_cap?.usd || data.market_cap || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('volume24h')}</div>
                <div class="stat-value">${formatLargeNumber(data.total_volume?.usd || data.total_volume || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('allTimeHigh')}</div>
                <div class="stat-value">${formatPrice(data.ath?.usd || data.high_24h || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('allTimeLow')}</div>
                <div class="stat-value">${formatPrice(data.atl?.usd || data.low_24h || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('circulatingSupply')}</div>
                <div class="stat-value">${formatLargeNumber(data.circulating_supply || 0)}</div>
            </div>
        `;

        // Description
        if (asset.description && asset.description.en) {
            description.innerHTML = `<p>${asset.description.en.substring(0, 500)}...</p>`;
            description.style.display = 'block';
        } else {
            description.style.display = 'none';
        }

        // Links
        if (asset.links) {
            let linksHTML = '';
            if (asset.links.homepage && asset.links.homepage[0]) {
                linksHTML += `<a href="${asset.links.homepage[0]}" target="_blank" class="modal-link">${t('website')}</a>`;
            }
            if (asset.links.blockchain_site && asset.links.blockchain_site[0]) {
                linksHTML += `<a href="${asset.links.blockchain_site[0]}" target="_blank" class="modal-link">${t('explorer')}</a>`;
            }
            links.innerHTML = linksHTML;
            links.style.display = linksHTML ? 'flex' : 'none';
        } else {
            links.style.display = 'none';
        }
    } else {
        // Stock or Steam item
        statsHTML = `
            <div class="stat-item">
                <div class="stat-label">${t('currentPrice')}</div>
                <div class="stat-value">${formatPrice(asset.price || asset.current_price || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('change24h')}</div>
                <div class="stat-value">${formatPercentage(asset.changePercent || asset.price_change_percentage_24h || 0)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t('volume24h')}</div>
                <div class="stat-value">${formatLargeNumber(asset.volume || 0)}</div>
            </div>
        `;
        description.style.display = 'none';
        links.style.display = 'none';
    }

    statsGrid.innerHTML = statsHTML;
}

// Render modal chart
function renderModalChart(prices, priceChange) {
    const canvas = document.getElementById('modalChart');
    if (!canvas) return;

    if (state.modalChart) {
        state.modalChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const isPositive = priceChange >= 0;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isPositive) {
        gradient.addColorStop(0, 'rgba(56, 239, 125, 0.3)');
        gradient.addColorStop(1, 'rgba(56, 239, 125, 0)');
    } else {
        gradient.addColorStop(0, 'rgba(255, 106, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 106, 0, 0)');
    }

    state.modalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map((_, i) => i),
            datasets: [{
                data: prices.map(p => p[1]),
                borderColor: isPositive ? '#38ef7d' : '#ff6a00',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: isPositive ? '#38ef7d' : '#ff6a00',
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 39, 64, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 16,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return formatPrice(context.parsed.y);
                        },
                        title: function (context) {
                            const daysAgo = prices.length - context[0].dataIndex - 1;
                            return daysAgo === 0 ? t('today') : `${daysAgo} ${t('daysAgo')}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { display: false }
                },
                y: {
                    display: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#718096',
                        callback: function (value) {
                            return formatPrice(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ===================================
// DATA LOADING
// ===================================

// Load data based on current tab
async function loadData() {
    if (state.isLoading) return;

    state.isLoading = true;
    showLoading();

    try {
        let data = [];

        switch (state.currentTab) {
            case 'crypto':
                data = await fetchMarketData();
                break;
            case 'stocks':
                if (typeof fetchAllStocks !== 'undefined') {
                    data = await fetchAllStocks();
                }
                break;
            case 'steam':
                if (typeof fetchAllSteamItems !== 'undefined') {
                    data = await fetchAllSteamItems();
                }
                break;
        }

        state.allAssets = data;
        applyFiltersAndSearch();
    } catch (error) {
        console.error('Failed to load data:', error);
        showError();
    } finally {
        state.isLoading = false;
    }
}

// ===================================
// EVENT HANDLERS
// ===================================

// Tab switching
elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.currentTab = btn.dataset.tab;
        state.currentFilter = 'all';

        // Reset filter buttons
        elements.filterBtns.forEach(b => b.classList.remove('active'));
        elements.filterBtns[0].classList.add('active');

        loadData();
    });
});

// Language switching
elements.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        setLanguage(btn.dataset.lang);

        // Re-render to update translations
        renderAssets();
    });
});

// Search
elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    applyFiltersAndSearch();
});

// Filter buttons
elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.currentFilter = btn.dataset.filter;
        applyFiltersAndSearch();
    });
});

// Retry button
elements.retryBtn.addEventListener('click', loadData);

// Modal close
elements.modalCloseBtn.addEventListener('click', closeDetailModal);
elements.detailModal.querySelector('.modal-backdrop').addEventListener('click', closeDetailModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.detailModal.classList.contains('active')) {
        closeDetailModal();
    }
});

// ===================================
// INITIALIZATION
// ===================================

// Initialize app
function init() {
    // Initialize language
    initLanguage();

    // Initialize widget generator if available
    if (typeof initWidgetGenerator === 'function') {
        initWidgetGenerator();
    }

    // Load initial data
    loadData();

    // Set up auto-refresh
    setInterval(() => {
        if (!elements.detailModal.classList.contains('active')) {
            loadData();
        }
    }, CONFIG.UPDATE_INTERVAL);
}

// Share individual coin (Telegram preview link)
function shareCoin(coinId, coinName, event) {
    // Stop event propagation to prevent card click
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const previewUrl = `https://adiru3.github.io/Crypto-Tracker/preview.html?coin=${coinId}`;

    navigator.clipboard.writeText(previewUrl).then(() => {
        // Show success notification
        const notification = document.createElement('div');
        notification.textContent = `✅ ${coinName || 'Coin'} link copied!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link');
    });
}

// Copy API Link to clipboard
function copyAPILink() {
    // Project-specific API endpoint (GitHub Pages)
    const apiUrl = 'https://adiru3.github.io/Crypto-Tracker/';

    navigator.clipboard.writeText(apiUrl).then(() => {
        // Show success notification
        const notification = document.createElement('div');
        notification.textContent = '✅ API link copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy API link');
    });
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
