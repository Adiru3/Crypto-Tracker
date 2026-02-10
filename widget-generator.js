// ===================================
// WIDGET GENERATOR
// ===================================

const WIDGET_CONFIG = {
    selectedAssets: [],
    widgetType: 'card',
    theme: 'dark',
    accentColor: '#667eea',
    width: 300,
    showChange: true,
    showLogo: true,
    refreshInterval: 60
};

// Widget generator state
let widgetState = {
    ...WIDGET_CONFIG,
    availableAssets: [],
    isOpen: false
};

// Open widget generator modal
function openWidgetGenerator() {
    widgetState.isOpen = true;
    document.getElementById('widgetModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load 250 assets
    widgetState.availableAssets = state.allAssets.slice(0, 250);
    renderAssetPicker();
    updateWidgetPreview();
}

// Close widget generator modal
function closeWidgetGenerator() {
    widgetState.isOpen = false;
    document.getElementById('widgetModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Render asset picker
function renderAssetPicker() {
    const container = document.getElementById('widgetAssetPicker');
    if (!container) return;

    const html = widgetState.availableAssets.map(asset => {
        const isSelected = widgetState.selectedAssets.some(a => a.id === asset.id || a.symbol === asset.symbol);
        const assetId = asset.id || asset.symbol;
        const price = asset.current_price || asset.price || 0;
        const change = asset.price_change_percentage_24h || asset.changePercent || 0;
        const changeClass = change >= 0 ? 'positive' : 'negative';

        return `
            <label class="asset-picker-item ${isSelected ? 'selected' : ''}" data-asset-id="${assetId}">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleAssetSelection('${assetId}')">
                <div class="asset-picker-info">
                    ${asset.image ? `<img src="${asset.image}" class="asset-picker-icon">` : ''}
                    <div class="asset-picker-details">
                        <div class="asset-picker-name">${asset.name}</div>
                        <div class="asset-picker-symbol">${asset.symbol ? asset.symbol.toUpperCase() : ''}</div>
                    </div>
                </div>
                <div class="asset-picker-price">
                    <div>${formatPrice(price)}</div>
                    <div class="asset-picker-change ${changeClass}">${formatPercentage(change)}</div>
                </div>
            </label>
        `;
    }).join('');

    container.innerHTML = html || '<div class="no-assets">Нет доступных активов</div>';
}

// Toggle asset selection
function toggleAssetSelection(assetId) {
    const asset = widgetState.availableAssets.find(a => (a.id || a.symbol) === assetId);
    if (!asset) return;

    const index = widgetState.selectedAssets.findIndex(a => (a.id || a.symbol) === assetId);

    if (index >= 0) {
        widgetState.selectedAssets.splice(index, 1);
    } else {
        // NO LIMIT - add unlimited assets!
        widgetState.selectedAssets.push(asset);
    }

    renderAssetPicker();
    updateWidgetPreview();
    updateSelectedCount();
}

// Update selected count
function updateSelectedCount() {
    const countEl = document.getElementById('selectedAssetsCount');
    if (countEl) {
        countEl.textContent = widgetState.selectedAssets.length; // Unlimited!
    }
}

// Search widget assets by name or symbol
function searchWidgetAssets(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        widgetState.availableAssets = state.allAssets.slice(0, 250);
    } else {
        widgetState.availableAssets = state.allAssets.filter(asset => {
            const name = (asset.name || '').toLowerCase();
            const symbol = (asset.symbol || '').toLowerCase();
            return name.includes(searchTerm) || symbol.includes(searchTerm);
        });
    }

    renderAssetPicker();
}

// Update widget customization
function updateWidgetConfig(key, value) {
    widgetState[key] = value;
    updateWidgetPreview();
}

// Update widget preview
function updateWidgetPreview() {
    const preview = document.getElementById('widgetPreview');
    if (!preview) return;

    if (widgetState.selectedAssets.length === 0) {
        preview.innerHTML = '<div class="widget-preview-empty">Выберите активы для предпросмотра</div>';
        return;
    }

    let html = '';

    switch (widgetState.widgetType) {
        case 'card':
            html = generateCardWidgetHTML();
            break;
        case 'ticker':
            html = generateTickerWidgetHTML();
            break;
        case 'list':
            html = generateListWidgetHTML();
            break;
    }

    preview.innerHTML = html;
}

// Generate card widget HTML
function generateCardWidgetHTML() {
    const isDark = widgetState.theme === 'dark';
    const bgColor = isDark ? '#1e2740' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';
    const secondaryColor = isDark ? '#a0aec0' : '#666666';

    return `
        <div class="crypto-widget-preview" style="background: ${bgColor}; color: ${textColor}; border-radius: 12px; padding: 16px; width: ${widgetState.width}px;">
            ${widgetState.selectedAssets.map(asset => {
        const price = asset.current_price || asset.price || 0;
        const change = asset.price_change_percentage_24h || asset.changePercent || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};">
                        ${widgetState.showLogo && asset.image ? `<img src="${asset.image}" style="width: 32px; height: 32px; border-radius: 50%;">` : ''}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">${asset.name}</div>
                            <div style="font-size: 12px; color: ${secondaryColor};">${asset.symbol ? asset.symbol.toUpperCase() : ''}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 14px;">${formatPrice(price)}</div>
                            ${widgetState.showChange ? `<div style="font-size: 12px; color: ${changeColor};">${formatPercentage(change)}</div>` : ''}
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// Generate ticker widget HTML
function generateTickerWidgetHTML() {
    const isDark = widgetState.theme === 'dark';
    const bgColor = isDark ? '#1e2740' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';

    return `
        <div class="crypto-widget-ticker" style="background: ${bgColor}; color: ${textColor}; border-radius: 8px; padding: 12px; width: ${widgetState.width}px; overflow: hidden;">
            <div style="display: flex; gap: 24px; animation: scroll-left 20s linear infinite;">
                ${widgetState.selectedAssets.concat(widgetState.selectedAssets).map(asset => {
        const price = asset.current_price || asset.price || 0;
        const change = asset.price_change_percentage_24h || asset.changePercent || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                        <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                            ${widgetState.showLogo && asset.image ? `<img src="${asset.image}" style="width: 20px; height: 20px;">` : ''}
                            <span style="font-weight: 600;">${asset.symbol ? asset.symbol.toUpperCase() : asset.name}</span>
                            <span>${formatPrice(price)}</span>
                            ${widgetState.showChange ? `<span style="color: ${changeColor};">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>` : ''}
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
        <style>
            @keyframes scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        </style>
    `;
}

// Generate list widget HTML
function generateListWidgetHTML() {
    const isDark = widgetState.theme === 'dark';
    const bgColor = isDark ? '#1e2740' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';

    return `
        <div class="crypto-widget-list" style="background: ${bgColor}; color: ${textColor}; border-radius: 12px; padding: 8px; width: ${widgetState.width}px;">
            ${widgetState.selectedAssets.map((asset, index) => {
        const price = asset.current_price || asset.price || 0;
        const change = asset.price_change_percentage_24h || asset.changePercent || 0;
        const changeColor = change >= 0 ? '#38ef7d' : '#ff6a00';

        return `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px; font-size: 13px;">
                        <div style="width: 20px; color: ${isDark ? '#718096' : '#999'};">${index + 1}</div>
                        ${widgetState.showLogo && asset.image ? `<img src="${asset.image}" style="width: 24px; height: 24px;">` : ''}
                        <div style="flex: 1; font-weight: 600;">${asset.symbol ? asset.symbol.toUpperCase() : asset.name}</div>
                        <div style="font-weight: 700;">${formatPrice(price)}</div>
                        ${widgetState.showChange ? `<div style="color: ${changeColor}; min-width: 60px; text-align: right;">${formatPercentage(change)}</div>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// Generate embeddable widget code
function generateWidgetCode() {
    if (widgetState.selectedAssets.length === 0) {
        return '<!-- Выберите активы для генерации виджета -->';
    }

    const assetIds = widgetState.selectedAssets.map(a => a.id || a.symbol).join(',');
    const isDark = widgetState.theme === 'dark';

    return `<!-- Crypto Tracker Widget -->
<div id="crypto-tracker-widget-${Date.now()}" 
     data-assets="${assetIds}"
     data-type="${widgetState.widgetType}"
     data-theme="${widgetState.theme}"
     data-color="${widgetState.accentColor}"
     data-width="${widgetState.width}"
     data-show-change="${widgetState.showChange}"
     data-show-logo="${widgetState.showLogo}"
     data-refresh="${widgetState.refreshInterval}">
    <div style="text-align: center; padding: 20px;">Loading...</div>
</div>

<script>
(function() {
    const widgetEl = document.currentScript.previousElementSibling;
    const assets = widgetEl.dataset.assets.split(',');
    const type = widgetEl.dataset.type;
    const theme = widgetEl.dataset.theme;
    const isDark = theme === 'dark';
    const width = widgetEl.dataset.width || 300;
    const showChange = widgetEl.dataset.showChange !== 'false';
    const showLogo = widgetEl.dataset.showLogo !== 'false';
    const refresh = parseInt(widgetEl.dataset.refresh) || 60;
    
    async function fetchAssetData() {
        const promises = assets.map(async (id) => {
            try {
                const res = await fetch(\`https://api.coingecko.com/api/v3/coins/\${id}\`);
                const data = await res.json();
                return {
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                    image: data.image.small,
                    price: data.market_data.current_price.usd,
                    change: data.market_data.price_change_percentage_24h
                };
            } catch {
                return null;
            }
        });
        
        return (await Promise.all(promises)).filter(a => a);
    }
    
    function renderWidget(assetsData) {
        const bgColor = isDark ? '#1e2740' : '#ffffff';
        const textColor = isDark ? '#ffffff' : '#000000';
        const secondaryColor = isDark ? '#a0aec0' : '#666666';
        
        let html = '';
        
        if (type === 'card') {
            html = \`<div style="background: \${bgColor}; color: \${textColor}; border-radius: 12px; padding: 16px; width: \${width}px; font-family: system-ui;">\`;
            assetsData.forEach(asset => {
                const changeColor = asset.change >= 0 ? '#38ef7d' : '#ff6a00';
                html += \`
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid \${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};">
                        \${showLogo ? \`<img src="\${asset.image}" style="width: 32px; height: 32px; border-radius: 50%;">\` : ''}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px;">\${asset.name}</div>
                            <div style="font-size: 12px; color: \${secondaryColor};">\${asset.symbol.toUpperCase()}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 14px;">$\${asset.price.toFixed(2)}</div>
                            \${showChange ? \`<div style="font-size: 12px; color: \${changeColor};">\${asset.change >= 0 ? '+' : ''}\${asset.change.toFixed(2)}%</div>\` : ''}
                        </div>
                    </div>
                \`;
            });
            html += '</div>';
        }
        
        widgetEl.innerHTML = html;
    }
    
    async function updateWidget() {
        const data = await fetchAssetData();
        if (data.length > 0) renderWidget(data);
    }
    
    updateWidget();
    setInterval(updateWidget, refresh * 1000);
})();
</script>`;
}

// Copy widget code to clipboard
async function copyWidgetCode() {
    const code = generateWidgetCode();
    const codeDisplay = document.getElementById('widgetCodeDisplay');

    try {
        await navigator.clipboard.writeText(code);

        // Show success message
        const copyBtn = document.getElementById('copyWidgetCodeBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Скопировано!';
        copyBtn.style.background = '#38ef7d';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback: select text
        codeDisplay.select();
        alert('Код готов к копированию. Нажмите Ctrl+C');
    }
}

// Update widget code display
function updateWidgetCodeDisplay() {
    const codeDisplay = document.getElementById('widgetCodeDisplay');
    if (codeDisplay) {
        codeDisplay.value = generateWidgetCode();
    }
}

// Initialize widget generator
function initWidgetGenerator() {
    // Add event listeners for customization controls
    const typeSelect = document.getElementById('widgetTypeSelect');
    const themeSelect = document.getElementById('widgetThemeSelect');
    const widthInput = document.getElementById('widgetWidthInput');
    const showChangeCheckbox = document.getElementById('widgetShowChange');
    const showLogoCheckbox = document.getElementById('widgetShowLogo');

    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            updateWidgetConfig('widgetType', e.target.value);
            updateWidgetCodeDisplay();
        });
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            updateWidgetConfig('theme', e.target.value);
            updateWidgetCodeDisplay();
        });
    }

    if (widthInput) {
        widthInput.addEventListener('input', (e) => {
            updateWidgetConfig('width', parseInt(e.target.value) || 300);
            updateWidgetCodeDisplay();
        });
    }

    if (showChangeCheckbox) {
        showChangeCheckbox.addEventListener('change', (e) => {
            updateWidgetConfig('showChange', e.target.checked);
            updateWidgetCodeDisplay();
        });
    }

    if (showLogoCheckbox) {
        showLogoCheckbox.addEventListener('change', (e) => {
            updateWidgetConfig('showLogo', e.target.checked);
            updateWidgetCodeDisplay();
        });
    }
}
