@echo off
REM GAGA AI Nexus Bot - Startup Script
REM This script starts the pairing server and opens the pairing HTML file

echo.
echo ╔════════════════════════════════════════╗
echo 🤖 GAGA AI NEXUS BOT - STARTUP
echo ©️  Copyright 2026 - TRAXXION GAGA
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  WARNING: .env file not found!
    echo Please create .env with your OPENAI_API_KEY
    echo.
    echo Example:
    echo OPENAI_API_KEY=sk-proj-your-key-here
    echo.
    pause
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting GAGA AI Pairing Server...
echo 📱 The pairing HTML will open automatically in 3 seconds...
echo.

REM Start the pairing server in the background
start "" node pairingServer.js

REM Wait 3 seconds for server to start
timeout /t 3 /nobreak

REM Get the full path of the pair.html file
for /f "delims=" %%A in ('cd') do set "SCRIPT_DIR=%%A"
set "HTML_FILE=%SCRIPT_DIR%\pair.html"

REM Open the HTML file
if exist "%HTML_FILE%" (
    echo ✅ Opening pairing interface...
    start "" "%HTML_FILE%"
) else (
    echo ❌ pair.html not found!
    pause
    exit /b 1
)

echo.
echo ✨ Bot is starting! The pairing interface will open in your browser.
echo.
echo 📝 Instructions:
echo 1. Select your country code
echo 2. Enter your WhatsApp number
echo 3. Click "🔗 Generate Pair Code"
echo 4. Open WhatsApp → Settings → Linked Devices
echo 5. Scan the code or enter it manually
echo 6. Click "✅ Connect"
echo 7. 🚀 Bot is now ACTIVE!
echo.
echo ℹ️  To stop the bot: Close this window or press Ctrl+C
echo.

REM Keep the console open
pause
