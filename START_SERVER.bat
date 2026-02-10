@echo off
echo ========================================
echo   CRYPTO TRACKER - Локальный сервер
echo ========================================
echo.

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python найден
    echo.
    echo Запуск сервера на http://localhost:8000
    echo.
    echo ВАЖНО: 
    echo 1. Откройте браузер и перейдите на http://localhost:8000
    echo 2. Для остановки сервера нажмите Ctrl+C
    echo.
    echo ========================================
    echo.
    
    cd /d "%~dp0"
    python -m http.server 8000
    goto :end
)

REM Если Python не найден, пробуем Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [ОШИБКА] Python не найден, но найден Node.js
    echo.
    echo Установите Python с https://www.python.org/downloads/
    echo Или используйте Node.js сервер (требуется установка пакета)
    echo.
    pause
    goto :end
)

REM Ни Python, ни Node не найдены
echo [ОШИБКА] Не найдены Python или Node.js
echo.
echo Установите Python: https://www.python.org/downloads/
echo При установке отметьте галочку "Add Python to PATH"
echo.
pause

:end
