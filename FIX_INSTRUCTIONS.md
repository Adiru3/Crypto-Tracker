# ИНСТРУКЦИЯ ПО ИСПРАВЛЕНИЮ index.html

## Проблема
В файле `index.html` строки 104-112 содержат escaped символны `\n` и `\"` вместо нормального HTML, из-за чего страница некорректно отображается.

## Решение

### Вариант 1: Ручное исправление

1. Откройте `index.html` в любом текстовом редакторе (VS Code, Notepad++, Sublime)
2. Найдите строку 104 (где начинается `<!-- Navigation Buttons -->\n`)
3. Удалите строки 104-112 полностью
4. Вставьте на их место этот чистый HTML код:

```html
                    <!-- Navigation Buttons -->
                    <div class="header-buttons-group">
                        <a href="widget-builder.html" class="widget-btn" title="Create embeddable widget">
                            <span>🎨</span>
                            <span data-i18n="createWidget">Create Widget</span>
                        </a>
                        <a href="api-docs.html" class="widget-btn api-btn" title="API Documentation">
                            <span>📚</span>
                            <span>API Docs</span>
                        </a>
                        <a href="https://github.com/Adiru3" target="_blank" class="widget-btn github-btn" title="GitHub Profile">
                            <span>💻</span>
                            <span>GitHub</span>
                        </a>
                        <a href="https://adiru3.github.io/Donate/" target="_blank" class="widget-btn donate-btn" title="Support the Project">
                            <span>❤️</span>
                            <span>Donate</span>
                        </a>
                    </div>

                    <!-- Language Selector -->
                    <div class="language-selector">
                        <button class="lang-btn active" data-lang="ru">🇷🇺 RU</button>
                        <button class="lang-btn" data-lang="ua">🇺🇦 UA</button>
                        <button class="lang-btn" data-lang="en">🇬🇧 EN</button>
                    </div>
```

5. Сохраните файл
6. Обновите страницу в браузере (F5)

### Вариант 2: Использовать готовый файл

Я создал файл `header-fixed.html` с правильным header'ом. Вы можете:
1. Открыть `header-fixed.html`
2. Скопировать содержимое
3. Заменить строки 95-118 в `index.html`

## Что должно получиться

После исправления в header должны отображаться 4 кнопки:
- 🎨 Create Widget
- 📚 API Docs
- 💻 GitHub
- ❤️ Donate

Плюс language selector справа.

## Дополнительно: Стили для кнопок

Также нужно добавить стили в `styles.css` после строки 96 (после `.widget-btn` стилей):

```css
/* Header Buttons Group */
.header-buttons-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.api-btn {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
}

.github-btn {
    background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%) !important;
}

.donate-btn {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
}
```

## Файлы в проекте

- `index.html.backup` - backup файл (создан автоматически)
- `header-fixed.html` - готовый исправленный header
- `fix-html.py` - Python скрипт (не работает из-за encoding ошибки)
- `api-docs.html` - создан, работает правильно
- Footers обновлены корректными ссылками

Если нужна помощь - просто скажите!
