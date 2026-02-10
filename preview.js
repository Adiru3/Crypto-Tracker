// Preview Page Logic for Telegram/Social Sharing
// Fetches and displays individual cryptocurrency data

const CONFIG = {
    API_BASE_URL: 'https://api.coingecko.com/api/v3',
    PROJECT_URL: 'https://adiru3.github.io/Crypto-Tracker',
    UPDATE_INTERVAL: 60000 // Auto-update every 60 seconds
};

// Global state
let currentCoinId = null;
let updateInterval = null;

// Get coin ID from URL parameter
function getCoinFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('coin');
}

// Format price with currency
function formatPrice(price) {
    if (price >= 1) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    } else if (price >= 0.01) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(price);
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 6,
            maximumFractionDigits: 8
        }).format(price);
    }
}

// Format large numbers
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

// Fetch coin data from API
async function fetchCoinData(coinId) {
    try {
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Coin not found');
        }

        return data[0];
    } catch (error) {
        console.error('Error fetching coin data:', error);
        throw error;
    }
}

// Update meta tags for Social/Telegram preview
function updateMetaTags(coinData) {
    const title = `${coinData.name} (${coinData.symbol.toUpperCase()}) - ${formatPrice(coinData.current_price)}`;
    const change = coinData.price_change_percentage_24h;
    const changeStr = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
    const description = `📈 ${changeStr} (24h) | Market Cap: ${formatLargeNumber(coinData.market_cap)}`;

    // Update page title
    document.getElementById('page-title').textContent = title;
    document.title = title;

    // Update Open Graph tags
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-description').setAttribute('content', description);
    document.getElementById('og-image').setAttribute('content', coinData.image || CONFIG.PROJECT_URL + '/crypto_tracker_og_image_1770746029606.png');
    document.getElementById('og-url').setAttribute('content', `${CONFIG.PROJECT_URL}/preview.html?coin=${coinData.id}`);

    // Update Twitter Card tags
    document.getElementById('twitter-title').setAttribute('content', title);
    document.getElementById('twitter-description').setAttribute('content', description);
    document.getElementById('twitter-image').setAttribute('content', coinData.image || CONFIG.PROJECT_URL + '/crypto_tracker_og_image_1770746029606.png');
}

// Render preview card
function renderPreview(coinData) {
    const previewContainer = document.getElementById('preview');
    const change = coinData.price_change_percentage_24h;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeText = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
    const changeIcon = change >= 0 ? '📈' : '📉';

    previewContainer.innerHTML = `
        <div class="preview-header">
            <img src="${coinData.image}" alt="${coinData.name}" class="preview-icon">
            <div class="preview-title">
                <h1>${coinData.name}</h1>
                <span class="symbol">${coinData.symbol.toUpperCase()}</span>
            </div>
        </div>
        
        <div class="preview-price" id="price-display">${formatPrice(coinData.current_price)}</div>
        
        <div class="preview-change ${changeClass}" id="change-display">
            ${changeIcon} ${changeText} (24h)
        </div>
        
        <div class="preview-stats" id="stats-display">
            <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value" id="mcap-value">${formatLargeNumber(coinData.market_cap)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">24h Volume</div>
                <div class="stat-value" id="volume-value">${formatLargeNumber(coinData.total_volume)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Market Rank</div>
                <div class="stat-value" id="rank-value">#${coinData.market_cap_rank}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">24h High</div>
                <div class="stat-value" id="high-value">${formatPrice(coinData.high_24h)}</div>
            </div>
        </div>
        
        <div class="preview-update-info" style="text-align: center; margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
            🔄 Auto-updates every 60 seconds
        </div>
        
        <div class="preview-actions">
            <button class="preview-btn preview-btn-primary" onclick="window.location.href='index.html'">
                View All Cryptocurrencies
            </button>
            <button class="preview-btn preview-btn-secondary" onclick="shareCoin('${coinData.id}')">
                🔗 Share
            </button>
            <button class="preview-btn preview-btn-secondary" onclick="generateWidget('${coinData.id}', '${coinData.name}')">
                🎨 Generate Widget
            </button>
        </div>
    `;
}

// Share coin function
function shareCoin(coinId) {
    const url = `${CONFIG.PROJECT_URL}/preview.html?coin=${coinId}`;

    navigator.clipboard.writeText(url).then(() => {
        // Show success notification
        const notification = document.createElement('div');
        notification.textContent = '✅ Link copied to clipboard!';
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

// Generate embeddable widget with options
function generateWidget(coinId, coinName) {
    const previewUrl = `${CONFIG.PROJECT_URL}/preview.html?coin=${coinId}`;
    const simpleWidgetUrl = `${CONFIG.PROJECT_URL}/widget.html?coin=${coinId}&mode=simple`;
    const detailedWidgetUrl = `${CONFIG.PROJECT_URL}/widget.html?coin=${coinId}&mode=detailed`;

    const simpleIframe = `<iframe src="${simpleWidgetUrl}" width="350" height="300" frameborder="0" style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"></iframe>`;
    const detailedIframe = `<iframe src="${detailedWidgetUrl}" width="450" height="600" frameborder="0" style="border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"></iframe>`;

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.85); display: flex; align-items: center;
        justify-content: center; z-index: 10000; padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #2d2d44 0%, #1e1e2e 100%); border-radius: 20px; padding: 2rem; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
            <h2 style="color: white; margin-bottom: 1.5rem; font-family: Inter, sans-serif; font-size: 1.75rem;">🎨 Share: ${coinName}</h2>
            
            <!-- Tab buttons -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button onclick="switchWidgetTab('preview')" id="tab-preview" class="widget-tab active" style="flex: 1; min-width: 140px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.75rem 1rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    🔗 Preview Link
                </button>
                <button onclick="switchWidgetTab('simple')" id="tab-simple" class="widget-tab" style="flex: 1; min-width: 140px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 0.75rem 1rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    📊 Simple Widget
                </button>
                <button onclick="switchWidgetTab('detailed')" id="tab-detailed" class="widget-tab" style="flex: 1; min-width: 140px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 0.75rem 1rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    📈 Detailed Widget
                </button>
            </div>
            
            <!-- Preview Link Tab -->
            <div id="widget-content-preview" class="widget-content">
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 1rem; font-family: Inter, sans-serif; font-size: 0.875rem;">
                    Share thislink in Telegram, Discord, or anywhere. Always shows detailed info with auto-update:
                </p>
                <textarea id="preview-link" readonly style="width: 100%; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem; color: #22c55e; font-family: 'Courier New', monospace; font-size: 0.875rem; resize: none;">${previewUrl}</textarea>
                <button onclick="copyCode('preview-link', 'Preview link')" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; font-size: 1rem;">
                    📋 Copy Preview Link
                </button>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-top: 1rem; font-family: Inter, sans-serif;">
                    ✨ Always shows: Price, Change, Market Cap, Volume, High/Low, Charts<br>
                    🔄 Auto-updates every 60 seconds after opening
                </p>
            </div>
            
            <!-- Simple Widget Tab -->
            <div id="widget-content-simple" class="widget-content" style="display: none;">
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; font-family: Inter, sans-serif; font-size: 0.875rem;">Preview:</p>
                <iframe src="${simpleWidgetUrl}" width="100%" height="300" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); margin-bottom: 1rem;"></iframe>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; font-family: Inter, sans-serif; font-size: 0.875rem;">Embed Code:</p>
                <textarea id="simple-widget-code" readonly style="width: 100%; height: 100px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem; color: #22c55e; font-family: 'Courier New', monospace; font-size: 0.875rem; resize: none;">${simpleIframe}</textarea>
                <button onclick="copyCode('simple-widget-code', 'Simple widget')" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; font-size: 1rem;">
                    📋 Copy Simple Widget
                </button>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-top: 1rem; font-family: Inter, sans-serif;">
                    📊 Shows: Price + 24h Change<br>
                    🔄 Auto-updates every 60 seconds
                </p>
            </div>
            
            <!-- Detailed Widget Tab -->
            <div id="widget-content-detailed" class="widget-content" style="display: none;">
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; font-family: Inter, sans-serif; font-size: 0.875rem;">Preview:</p>
                <iframe src="${detailedWidgetUrl}" width="100%" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); margin-bottom: 1rem;"></iframe>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; font-family: Inter, sans-serif; font-size: 0.875rem;">Embed Code:</p>
                <textarea id="detailed-widget-code" readonly style="width: 100%; height: 100px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem; color: #22c55e; font-family: 'Courier New', monospace; font-size: 0.875rem; resize: none;">${detailedIframe}</textarea>
                <button onclick="copyCode('detailed-widget-code', 'Detailed widget')" style="width: 100%; margin-top: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer; font-size: 1rem;">
                    📋 Copy Detailed Widget
                </button>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; margin-top: 1rem; font-family: Inter, sans-serif;">
                    📈 Shows: Price, Change, Market Cap, Volume, High/Low, 7-day chart, Daily profit<br>
                    🔄 Auto-updates every 60 seconds
                </p>
            </div>
            
            <button onclick="this.closest('div').parentElement.remove()" style="width: 100%; margin-top: 1.5rem; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.15); padding: 0.75rem 1.5rem; border-radius: 10px; font-family: Inter, sans-serif; font-weight: 600; cursor: pointer;">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// Switch between widget tabs
function switchWidgetTab(tab) {
    // Hide all content
    document.querySelectorAll('.widget-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.widget-tab').forEach(el => {
        el.style.background = 'rgba(255,255,255,0.1)';
        el.style.color = 'rgba(255,255,255,0.7)';
        el.style.border = '1px solid rgba(255,255,255,0.2)';
    });

    // Show selected
    document.getElementById(`widget-content-${tab}`).style.display = 'block';
    const activeTab = document.getElementById(`tab-${tab}`);
    activeTab.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    activeTab.style.color = 'white';
    activeTab.style.border = 'none';
}

// Copy code helper
function copyCode(textareaId, type) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');

    const notification = document.createElement('div');
    notification.textContent = `✅ ${type} copied!`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; padding: 1rem 1.5rem; border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); z-index: 10001;
        font-weight: 600; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 3000);
}

// Show loading state
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('preview').style.display = 'none';
}

// Show error state
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('preview').style.display = 'none';
}

// Show preview state
function showPreview() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('preview').style.display = 'block';
}

// Update existing preview data (without re-rendering entire HTML)
async function updatePreviewData() {
    if (!currentCoinId) return;

    try {
        const coinData = await fetchCoinData(currentCoinId);

        // Update price
        const priceEl = document.getElementById('price-display');
        if (priceEl) priceEl.textContent = formatPrice(coinData.current_price);

        // Update change
        const changeEl = document.getElementById('change-display');
        if (changeEl) {
            const change = coinData.price_change_percentage_24h;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeText = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
            const changeIcon = change >= 0 ? '📈' : '📉';
            changeEl.className = `preview-change ${changeClass}`;
            changeEl.textContent = `${changeIcon} ${changeText} (24h)`;
        }

        // Update stats
        const mcapEl = document.getElementById('mcap-value');
        if (mcapEl) mcapEl.textContent = formatLargeNumber(coinData.market_cap);

        const volumeEl = document.getElementById('volume-value');
        if (volumeEl) volumeEl.textContent = formatLargeNumber(coinData.total_volume);

        const highEl = document.getElementById('high-value');
        if (highEl) highEl.textContent = formatPrice(coinData.high_24h);

        // Update meta tags
        updateMetaTags(coinData);

        console.log(`Updated ${coinData.name} data at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        console.error('Failed to update data:', error);
    }
}

// Start auto-update interval
function startAutoUpdate() {
    // Clear any existing interval
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Set new interval
    updateInterval = setInterval(updatePreviewData, CONFIG.UPDATE_INTERVAL);
    console.log('Auto-update started (60 sec interval)');
}

// Stop auto-update
function stopAutoUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('Auto-update stopped');
    }
}

// Initialize preview page
async function init() {
    const coinId = getCoinFromURL();

    // If no coin specified, redirect to main page
    if (!coinId) {
        window.location.href = 'index.html';
        return;
    }

    currentCoinId = coinId;
    showLoading();

    try {
        const coinData = await fetchCoinData(coinId);
        updateMetaTags(coinData);
        renderPreview(coinData);
        showPreview();

        // Start auto-update
        startAutoUpdate();
    } catch (error) {
        console.error('Failed to load coin:', error);
        showError();
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
