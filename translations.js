// ===================================
// TRANSLATIONS SYSTEM
// ===================================

const translations = {
    ru: {
        // Header
        appTitle: 'Crypto Tracker',
        appSubtitle: 'Анализ рынка в реальном времени',

        // Tabs
        tabCrypto: 'Криптовалюты',
        tabStocks: 'Акции',
        tabSteam: 'Steam Маркет',

        // Search & Filters
        searchPlaceholder: '🔍 Поиск...',
        filterAll: 'Все',
        filterTopGainers: '🚀 Самые выгодные',
        filterTopLosers: '📉 Самые невыгодные',
        filterMostExpensive: '💎 Самые дорогие',
        filterLeastExpensive: '💰 Самые дешёвые',
        filterHighestMcap: '🏆 Высокая капитализация',
        filterRecommended: '⭐ Рекомендации',

        // Loading & Errors
        loading: 'Загрузка данных...',
        errorLoading: 'Ошибка загрузки данных',
        retryButton: 'Попробовать снова',
        noResults: 'Ничего не найдено',
        noResultsDesc: 'Попробуйте изменить поисковой запрос или фильтр',

        // Coin Card
        marketCap: 'Рын. капитализация',
        volume24h: 'Объём (24ч)',
        high24h: 'Макс. за 24ч',
        low24h: 'Мин. за 24ч',
        change24h: 'за 24ч',
        change7d: 'за 7д',
        change30d: 'за 30д',

        // Detailed View
        detailsTitle: 'Детальная информация',
        closeButton: 'Закрыть',
        overview: 'Обзор',
        statistics: 'Статистика',
        about: 'О проекте',
        links: 'Ссылки',

        currentPrice: 'Текущая цена',
        priceChange: 'Изменение цены',
        allTimeHigh: 'Максимум за всё время',
        allTimeLow: 'Минимум за всё время',
        circulatingSupply: 'В обращении',
        totalSupply: 'Общее количество',
        maxSupply: 'Максимальное количество',
        marketDominance: 'Доминация рынка',
        rank: 'Ранг',

        // Stock specific
        stockPrice: 'Цена акции',
        openPrice: 'Цена открытия',
        closePrice: 'Цена закрытия',
        dividendYield: 'Дивидендная доходность',
        peRatio: 'P/E коэффициент',

        // Steam specific
        itemName: 'Название предмета',
        game: 'Игра',
        salesVolume: 'Объём продаж',
        listings: 'Активных лотов',

        // Recommendations
        recommendationsTitle: 'Рекомендации',
        recommendedBuy: 'Рекомендуется к покупке',
        recommendedHold: 'Рекомендуется держать',
        recommendedSell: 'Рекомендуется продать',
        trendingUp: 'Растущий тренд',
        highVolume: 'Высокий объём торгов',
        recentlyAdded: 'Недавно добавлено',

        // Footer
        footerText: 'Данные предоставлены',
        footerNote: 'Обновление каждые 60 секунд',

        // Time periods
        day: 'день',
        days: 'дн.',
        week: 'неделя',
        month: 'месяц',
        year: 'год',
        today: 'Сегодня',
        yesterday: 'Вчера',
        daysAgo: 'дн. назад',

        // Common
        price: 'Цена',
        volume: 'Объём',
        supply: 'Предложение',
        unlimited: 'Неограничено',
        notAvailable: 'Н/Д',
        viewDetails: 'Подробнее',
        website: 'Веб-сайт',
        explorer: 'Эксплорер',
        sourceCode: 'Исходный код',
        whitepaper: 'White Paper',
        community: 'Сообщество',

        // Widget Generator
        createWidget: 'Создать виджет',
        widgetGenerator: 'Генератор Виджетов',
        selectAssets: 'Выбор активов',
        preview: 'Предпросмотр',
        settings: 'Настройки',
        widgetType: 'Тип виджета',
        widgetTypeCard: 'Карточки',
        widgetTypeTicker: 'Бегущая строка',
        widgetTypeList: 'Список',
        theme: 'Тема',
        themeDark: 'Тёмная',
        themeLight: 'Светлая',
        widgetWidth: 'Ширина (px)',
        showChange: 'Показывать изменение',
        showLogo: 'Показывать логотипы',
        generatedCode: 'Готовый код',
        copyCode: 'Копировать код',
        maxAssetsReached: 'Максимум 10 активов'
    },

    ua: {
        // Header
        appTitle: 'Crypto Tracker',
        appSubtitle: 'Аналіз ринку в реальному часі',

        // Tabs
        tabCrypto: 'Криптовалюти',
        tabStocks: 'Акції',
        tabSteam: 'Steam Маркет',

        // Search & Filters
        searchPlaceholder: '🔍 Пошук...',
        filterAll: 'Всі',
        filterTopGainers: '🚀 Найвигідніші',
        filterTopLosers: '📉 Найневигідніші',
        filterMostExpensive: '💎 Найдорожчі',
        filterLeastExpensive: '💰 Найдешевші',
        filterHighestMcap: '🏆 Висока капіталізація',
        filterRecommended: '⭐ Рекомендації',

        // Loading & Errors
        loading: 'Завантаження даних...',
        errorLoading: 'Помилка завантаження даних',
        retryButton: 'Спробувати знову',
        noResults: 'Нічого не знайдено',
        noResultsDesc: 'Спробуйте змінити пошуковий запит або фільтр',

        // Coin Card
        marketCap: 'Ринк. капіталізація',
        volume24h: 'Об\'єм (24г)',
        high24h: 'Макс. за 24г',
        low24h: 'Мін. за 24г',
        change24h: 'за 24г',
        change7d: 'за 7д',
        change30d: 'за 30д',

        // Detailed View
        detailsTitle: 'Детальна інформація',
        closeButton: 'Закрити',
        overview: 'Огляд',
        statistics: 'Статистика',
        about: 'Про проект',
        links: 'Посилання',

        currentPrice: 'Поточна ціна',
        priceChange: 'Зміна ціни',
        allTimeHigh: 'Максимум за весь час',
        allTimeLow: 'Мінімум за весь час',
        circulatingSupply: 'В обігу',
        totalSupply: 'Загальна кількість',
        maxSupply: 'Максимальна кількість',
        marketDominance: 'Домінація ринку',
        rank: 'Ранг',

        // Stock specific
        stockPrice: 'Ціна акції',
        openPrice: 'Ціна відкриття',
        closePrice: 'Ціна закриття',
        dividendYield: 'Дивідендна дохідність',
        peRatio: 'P/E коефіцієнт',

        // Steam specific
        itemName: 'Назва предмета',
        game: 'Гра',
        salesVolume: 'Об\'єм продажів',
        listings: 'Активних лотів',

        // Recommendations
        recommendationsTitle: 'Рекомендації',
        recommendedBuy: 'Рекомендується до покупки',
        recommendedHold: 'Рекомендується тримати',
        recommendedSell: 'Рекомендується продати',
        trendingUp: 'Зростаючий тренд',
        highVolume: 'Високий об\'єм торгів',
        recentlyAdded: 'Нещодавно додано',

        // Footer
        footerText: 'Дані надані',
        footerNote: 'Оновлення кожні 60 секунд',

        // Time periods
        day: 'день',
        days: 'дн.',
        week: 'тиждень',
        month: 'місяць',
        year: 'рік',
        today: 'Сьогодні',
        yesterday: 'Вчора',
        daysAgo: 'дн. тому',

        // Common
        price: 'Ціна',
        volume: 'Об\'єм',
        supply: 'Пропозиція',
        unlimited: 'Необмежено',
        notAvailable: 'Н/Д',
        viewDetails: 'Детальніше',
        website: 'Веб-сайт',
        explorer: 'Експлорер',
        sourceCode: 'Вихідний код',
        whitepaper: 'White Paper',
        community: 'Спільнота',

        // Widget Generator
        createWidget: 'Створити віджет',
        widgetGenerator: 'Генератор Віджетів',
        selectAssets: 'Вибір активів',
        preview: 'Попередній перегляд',
        settings: 'Налаштування',
        widgetType: 'Тип віджета',
        widgetTypeCard: 'Картки',
        widgetTypeTicker: 'Біжучий рядок',
        widgetTypeList: 'Список',
        theme: 'Тема',
        themeDark: 'Темна',
        themeLight: 'Світла',
        widgetWidth: 'Ширина (px)',
        showChange: 'Показувати зміну',
        showLogo: 'Показувати логотипи',
        generatedCode: 'Готовий код',
        copyCode: 'Копіювати код',
        maxAssetsReached: 'Максимум 10 активів'
    },

    en: {
        // Header
        appTitle: 'Crypto Tracker',
        appSubtitle: 'Real-time market analysis',

        // Tabs
        tabCrypto: 'Cryptocurrency',
        tabStocks: 'Stocks',
        tabSteam: 'Steam Market',

        // Search & Filters
        searchPlaceholder: '🔍 Search...',
        filterAll: 'All',
        filterTopGainers: '🚀 Top Gainers',
        filterTopLosers: '📉 Top Losers',
        filterMostExpensive: '💎 Most Expensive',
        filterLeastExpensive: '💰 Least Expensive',
        filterHighestMcap: '🏆 Highest Market Cap',
        filterRecommended: '⭐ Recommended',

        // Loading & Errors
        loading: 'Loading data...',
        errorLoading: 'Error loading data',
        retryButton: 'Try Again',
        noResults: 'No results found',
        noResultsDesc: 'Try changing your search query or filter',

        // Coin Card
        marketCap: 'Market Cap',
        volume24h: 'Volume (24h)',
        high24h: 'High (24h)',
        low24h: 'Low (24h)',
        change24h: '24h',
        change7d: '7d',
        change30d: '30d',

        // Detailed View
        detailsTitle: 'Detailed Information',
        closeButton: 'Close',
        overview: 'Overview',
        statistics: 'Statistics',
        about: 'About',
        links: 'Links',

        currentPrice: 'Current Price',
        priceChange: 'Price Change',
        allTimeHigh: 'All-Time High',
        allTimeLow: 'All-Time Low',
        circulatingSupply: 'Circulating Supply',
        totalSupply: 'Total Supply',
        maxSupply: 'Max Supply',
        marketDominance: 'Market Dominance',
        rank: 'Rank',

        // Stock specific
        stockPrice: 'Stock Price',
        openPrice: 'Open Price',
        closePrice: 'Close Price',
        dividendYield: 'Dividend Yield',
        peRatio: 'P/E Ratio',

        // Steam specific
        itemName: 'Item Name',
        game: 'Game',
        salesVolume: 'Sales Volume',
        listings: 'Active Listings',

        // Recommendations
        recommendationsTitle: 'Recommendations',
        recommendedBuy: 'Recommended to Buy',
        recommendedHold: 'Recommended to Hold',
        recommendedSell: 'Recommended to Sell',
        trendingUp: 'Trending Up',
        highVolume: 'High Trading Volume',
        recentlyAdded: 'Recently Added',

        // Footer
        footerText: 'Data provided by',
        footerNote: 'Updates every 60 seconds',

        // Time periods
        day: 'day',
        days: 'd',
        week: 'week',
        month: 'month',
        year: 'year',
        today: 'Today',
        yesterday: 'Yesterday',
        daysAgo: 'd ago',

        // Common
        price: 'Price',
        volume: 'Volume',
        supply: 'Supply',
        unlimited: 'Unlimited',
        notAvailable: 'N/A',
        viewDetails: 'View Details',
        website: 'Website',
        explorer: 'Explorer',
        sourceCode: 'Source Code',
        whitepaper: 'White Paper',
        community: 'Community',

        // Widget Generator
        createWidget: 'Create Widget',
        widgetGenerator: 'Widget Generator',
        selectAssets: 'Select Assets',
        preview: 'Preview',
        settings: 'Settings',
        widgetType: 'Widget Type',
        widgetTypeCard: 'Cards',
        widgetTypeTicker: 'Ticker',
        widgetTypeList: 'List',
        theme: 'Theme',
        themeDark: 'Dark',
        themeLight: 'Light',
        widgetWidth: 'Width (px)',
        showChange: 'Show Change',
        showLogo: 'Show Logos',
        generatedCode: 'Generated Code',
        copyCode: 'Copy Code',
        maxAssetsReached: 'Maximum 10 assets'
    }
};

// Current language (default: Russian)
let currentLanguage = 'ru';

// Get translation
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Set language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        updateAllTranslations();
    }
}

// Update all UI text with current language
function updateAllTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            // Preserve emoji and other special content
            const emoji = element.querySelector('.emoji');
            if (emoji) {
                element.innerHTML = emoji.outerHTML + ' ' + translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Update active filter button text
    updateFilterButtons();
}

// Update filter button texts
function updateFilterButtons() {
    const filterMap = {
        'all': 'filterAll',
        'top-gainers': 'filterTopGainers',
        'top-losers': 'filterTopLosers',
        'most-expensive': 'filterMostExpensive',
        'least-expensive': 'filterLeastExpensive',
        'highest-mcap': 'filterHighestMcap',
        'recommended': 'filterRecommended'
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        if (filterMap[filter]) {
            btn.textContent = t(filterMap[filter]);
        }
    });
}

// Initialize language from localStorage or browser
function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.slice(0, 2);

    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else if (browserLang === 'ru' || browserLang === 'uk') {
        currentLanguage = browserLang === 'uk' ? 'ua' : 'ru';
    } else {
        currentLanguage = 'en';
    }

    updateAllTranslations();
}
