// Quick test to verify everything loads
console.log('=== CRYPTO TRACKER DEBUG ===');
console.log('1. Chart.js loaded:', typeof Chart !== 'undefined');
console.log('2. Translations loaded:', typeof t !== 'undefined');
console.log('3. Stocks API loaded:', typeof fetchAllStocks !== 'undefined');
console.log('4. Steam API loaded:', typeof fetchAllSteamItems !== 'undefined');
console.log('5. Current language:', typeof currentLanguage !== 'undefined' ? currentLanguage : 'not set');
console.log('========================');
