#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix corrupted HTML in index.html by replacing escaped symbols"""

input_file = 'index.html'
output_file = 'index.html'
backup_file = 'index.html.bak'

# Read the file
with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Create backup
with open(backup_file, 'w', encoding='utf-8') as f:
    f.write(content)

# The corrupted section (lines 104-112)
corrupted = '''                    <!-- Navigation Buttons -->\\n                    <div class=\"header-buttons-group\">\\n                        <a href=\"widget-builder.html\"
                            class=\"widget-btn\" title=\"Create embeddable widget\">\\n                            <span>🎨</span>\\n                            <span
                                data-i18n=\"createWidget\">Create Widget</span>\\n                        </a>\\n                        <a href=\"api-docs.html\"
                            class=\"widget-btn api-btn\" title=\"API Documentation\">\\n                            <span>📚</span>\\n                            <span>API
                                Docs</span>\\n                        </a>\\n                        <a href=\"https://github.com/Adiru3\" target=\"_blank\"
                            class=\"widget-btn github-btn\" title=\"GitHub Profile\">\\n                            <span>💻</span>\\n
                            <span>GitHub</span>\\n                        </a>\\n                        <a href=\"https://adiru3.github.io/Donate/\" target=\"_blank\"
                            class=\"widget-btn donate-btn\" title=\"Support the Project\">\\n                            <span>❤️</span>\\n
                            <span>Donate</span>\\n                        </a>\\n                    </div>'''

# The fixed version
fixed = '''                    <!-- Navigation Buttons -->
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
                    </div>'''

# Replace
content = content.replace(corrupted, fixed)

# Write back
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Fixed index.html!')
print('📦 Backup saved to index.html.bak')
