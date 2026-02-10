// Widget Builder State
const builderState = {
    allAssets: [],
    filteredAssets: [],
    selectedAssets: [],
    category: 'all',
    widgetType: 'card',
    theme: 'dark',
    colors: {
        primary: '#667eea',
        background: '#1e2740',
        text: '#ffffff'
    },
    width: 400,
    borderRadius: 12,
    showLogos: true,
    showChange: true,
    showShadow: true,
    enableAnimation: false,
    previewDevice: 'desktop',
    previewBg: '#1a1d2e'
};

// Initialize
async function init() {
    await loadAssets();
    renderAssetList();
    updatePreview();
}

// Load cryptocurrency data
async function loadAssets() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h');
        const data = await response.json();
        builderState.allAssets = data;
        builderState.filteredAssets = data;
    } catch (error) {
        console.error('Failed to load assets:', error);
        builderState.allAssets = [];
        builderState.filteredAssets = [];
    }
}

// Search assets
function searchAssets(query) {
    const term = query.toLowerCase().trim();

    if (!term) {
        builderState.filteredAssets = builderState.allAssets;
    } else {
        builderState.filteredAssets = builderState.allAssets.filter(asset =>
            asset.name.toLowerCase().includes(term) ||
            asset.symbol.toLowerCase().includes(term)
        );
    }

    renderAssetList();
}

// Filter by category
function filterByCategory(category) {
    builderState.category = category;

    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    // Filter assets
    switch (category) {
        case 'top10':
            builderState.filteredAssets = builderState.allAssets.slice(0, 10);
            break;
        case 'defi':
            builderState.filteredAssets = builderState.allAssets.filter(a =>
                ['uniswap', 'aave', 'maker', 'compound', 'curve-dao-token', 'sushi'].includes(a.id)
            );
            break;
        case 'meme':
            builderState.filteredAssets = builderState.allAssets.filter(a =>
                ['dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk'].includes(a.id)
            );
            break;
        default:
            builderState.filteredAssets = builderState.allAssets;
    }

    renderAssetList();
}

// Render asset list
function renderAssetList() {
    const container = document.getElementById('assetList');

    if (builderState.filteredAssets.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #a0aec0;">No assets found</div>';
        return;
    }

    const html = builderState.filteredAssets.map(asset => {
        const isSelected = builderState.selectedAssets.some(a => a.id === asset.id);
        const change = asset.price_change_percentage_24h || 0;
        const changeClass = change >= 0 ? 'positive' : 'negative';

        return `
            <div class="asset-item ${isSelected ? 'selected' : ''}" onclick="toggleAsset('${asset.id}')">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="event.stopPropagation(); toggleAsset('${asset.id}')">
                <img src="${asset.image}" class="asset-icon" alt="${asset.name}">
                <div class="asset-info">
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-symbol">${asset.symbol}</div>
                </div>
                <div class="asset-price">
                    <div class="asset-price-value">$${asset.current_price.toFixed(2)}</div>
                    <div class="asset-change ${changeClass}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    updateSelectedCount();
}

// Toggle asset selection
function toggleAsset(assetId) {
    const asset = builderState.filteredAssets.find(a => a.id === assetId);
    if (!asset) return;

    const index = builderState.selectedAssets.findIndex(a => a.id === assetId);

    if (index >= 0) {
        builderState.selectedAssets.splice(index, 1);
    } else {
        builderState.selectedAssets.push(asset);
    }

    renderAssetList();
    updatePreview();
}

// Clear all selected assets
function clearAllAssets() {
    builderState.selectedAssets = [];
    renderAssetList();
    updatePreview();
}

// Update selected count
function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = builderState.selectedAssets.length;
}

// Widget customization
function setWidgetType(type) {
    builderState.widgetType = type;
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    updatePreview();
}

function setTheme(theme) {
    builderState.theme = theme;
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    // Update default colors
    if (theme === 'dark') {
        builderState.colors.background = '#1e2740';
        builderState.colors.text = '#ffffff';
        document.getElementById('bgColor').value = '#1e2740';
        document.getElementById('textColor').value = '#ffffff';
    } else {
        builderState.colors.background = '#ffffff';
        builderState.colors.text = '#000000';
        document.getElementById('bgColor').value = '#ffffff';
        document.getElementById('textColor').value = '#000000';
    }

    updatePreview();
}

function updateColor(type, value) {
    builderState.colors[type] = value;
    updatePreview();
}

function updateWidth(value) {
    builderState.width = parseInt(value);
    document.getElementById('widthValue').textContent = `${value}px`;
    updatePreview();
}

function updateRadius(value) {
    builderState.borderRadius = parseInt(value);
    document.getElementById('radiusValue').textContent = `${value}px`;
    updatePreview();
}

function toggleOption(option, checked) {
    switch (option) {
        case 'logos':
            builderState.showLogos = checked;
            break;
        case 'change':
            builderState.showChange = checked;
            break;
        case 'shadow':
            builderState.showShadow = checked;
            break;
        case 'animation':
            builderState.enableAnimation = checked;
            break;
    }
    updatePreview();
}

function setPreviewDevice(device) {
    builderState.previewDevice = device;
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.device === device);
    });

    const wrapper = document.getElementById('previewWrapper');
    wrapper.className = `preview-wrapper ${device}`;
}

function updatePreviewBg(color) {
    builderState.previewBg = color;
    document.getElementById('previewContainer').style.background = color;
}

// Update preview
function updatePreview() {
    const container = document.getElementById('previewWrapper');

    if (builderState.selectedAssets.length === 0) {
        container.innerHTML = `
            <div class="preview-empty">
                <div class="empty-icon">🎨</div>
                <h3>Select assets to start</h3>
                <p>Choose cryptocurrencies from the left panel</p>
            </div>
        `;
        return;
    }

    const widgetHTML = generateWidgetHTML();
    container.innerHTML = widgetHTML;
}

// Generate widget HTML
function generateWidgetHTML() {
    const { theme, colors, width, borderRadius, showLogos, showChange, showShadow, enableAnimation, widgetType } = builderState;
    const isDark = theme === 'dark';
    const bgColor = colors.background;
    const textColor = colors.text;
    const secondaryColor = isDark ? '#a0aec0' : '#666666';

    const containerStyle = `
        background: ${bgColor};
        color: ${textColor};
        border-radius: ${borderRadius}px;
        padding: 16px;
        width: ${width}px;
        font-family: 'Inter', sans-serif;
        ${showShadow ? 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);' : ''}
        ${enableAnimation ? 'transition: all 0.3s;' : ''}
    `.trim();

    switch (widgetType) {
        case 'card':
            return generateCardWidget(containerStyle, textColor, secondaryColor, isDark);
        case 'ticker':
            return generateTickerWidget(containerStyle, textColor, isDark);
        case 'list':
            return generateListWidget(containerStyle, textColor, secondaryColor, isDark);
        case 'grid':
            return generateGridWidget(containerStyle, textColor, secondaryColor, isDark);
        default:
            return '';
    }
}

function generateCardWidget(containerStyle, textColor, secondaryColor, isDark) {
    return `
        <div style="${containerStyle}">
            ${builderState.selectedAssets.map(asset => {
        const change = asset.price_change_percentage_24h || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};">
                        ${builderState.showLogos ? `<img src="${asset.image}" style="width: 32px; height: 32px; border-radius: 50%;">` : ''}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">${asset.name}</div>
                            <div style="font-size: 12px; color: ${secondaryColor};">${asset.symbol.toUpperCase()}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 14px;">$${asset.current_price.toFixed(2)}</div>
                            ${builderState.showChange ? `<div style="font-size: 12px; color: ${changeColor};">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>` : ''}
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function generateTickerWidget(containerStyle, textColor, isDark) {
    return `
        <div style="${containerStyle} overflow: hidden;">
            <div style="display: flex; gap: 24px; animation: scroll-left 20s linear infinite;">
                ${builderState.selectedAssets.concat(builderState.selectedAssets).map(asset => {
        const change = asset.price_change_percentage_24h || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                        <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                            ${builderState.showLogos ? `<img src="${asset.image}" style="width: 20px; height: 20px;">` : ''}
                            <span style="font-weight: 600;">${asset.symbol.toUpperCase()}</span>
                            <span>$${asset.current_price.toFixed(2)}</span>
                            ${builderState.showChange ? `<span style="color: ${changeColor};">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>` : ''}
                        </div>
                    `;
    }).join('')}
            </div>
            <style>
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            </style>
        </div>
    `;
}

function generateListWidget(containerStyle, textColor, secondaryColor, isDark) {
    return `
        <div style="${containerStyle}">
            ${builderState.selectedAssets.map((asset, index) => {
        const change = asset.price_change_percentage_24h || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px; font-size: 13px;">
                        <div style="width: 20px; color: ${isDark ? '#718096' : '#999'};">${index + 1}</div>
                        ${builderState.showLogos ? `<img src="${asset.image}" style="width: 24px; height: 24px;">` : ''}
                        <div style="flex: 1; font-weight: 600;">${asset.symbol.toUpperCase()}</div>
                        <div style="font-weight: 700;">$${asset.current_price.toFixed(2)}</div>
                        ${builderState.showChange ? `<div style="color: ${changeColor}; min-width: 60px; text-align: right;">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function generateGridWidget(containerStyle, textColor, secondaryColor, isDark) {
    return `
        <div style="${containerStyle} display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
            ${builderState.selectedAssets.map(asset => {
        const change = asset.price_change_percentage_24h || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                    <div style="padding: 12px; background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; border-radius: 8px; text-align: center;">
                        ${builderState.showLogos ? `<img src="${asset.image}" style="width: 40px; height: 40px; margin-bottom: 8px;">` : ''}
                        <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px;">${asset.symbol.toUpperCase()}</div>
                        <div style="font-weight: 700; font-size: 14px;">$${asset.current_price.toFixed(2)}</div>
                        ${builderState.showChange ? `<div style="font-size: 11px; color: ${changeColor}; margin-top: 4px;">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// Export functions
async function exportHTML() {
    const code = generateExportCode('html');
    await copyToClipboard(code);
    showNotification('✅ HTML copied to clipboard!');
}

async function exportIframe() {
    const code = generateExportCode('iframe');
    await copyToClipboard(code);
    showNotification('✅ iframe code copied!');
}

async function exportReact() {
    const code = generateExportCode('react');
    await copyToClipboard(code);
    showNotification('✅ React component copied!');
}

function generateExportCode(type) {
    const widgetHTML = generateWidgetHTML();

    switch (type) {
        case 'html':
            return `<!-- Crypto Widget -->\n${widgetHTML}`;
        case 'iframe':
            return `<iframe srcdoc="${widgetHTML.replace(/"/g, '&quot;')}" style="border: none; width: 100%; height: 400px;"></iframe>`;
        case 'react':
            return `function CryptoWidget() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: \`${widgetHTML}\` }} />\n  );\n}`;
        default:
            return widgetHTML;
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function showNotification(message) {
    // Simple notification (you can enhance this)
    alert(message);
}

function downloadWidget() {
    const code = generateWidgetHTML();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto-widget.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('✅ Widget downloaded!');
}

// Help modal
function toggleHelp() {
    document.getElementById('helpModal').classList.toggle('active');
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
