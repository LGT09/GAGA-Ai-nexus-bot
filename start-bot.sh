#!/bin/bash

# GAGA AI Nexus Bot - Startup Script
# This script starts the pairing server and opens the pairing HTML file

echo ""
echo "╔════════════════════════════════════════╗"
echo "🤖 GAGA AI NEXUS BOT - STARTUP"
echo "©️  Copyright 2026 - TRAXXION GAGA"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create .env with your OPENAI_API_KEY"
    echo ""
    echo "Example:"
    echo "OPENAI_API_KEY=sk-proj-your-key-here"
    echo ""
    read -p "Press Enter to continue..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "🚀 Starting GAGA AI Pairing Server..."
echo "📱 The pairing HTML will open automatically in 3 seconds..."
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start the pairing server in the background
node "$SCRIPT_DIR/pairingServer.js" &
SERVER_PID=$!

# Wait 3 seconds for server to start
sleep 3

# Open the HTML file
HTML_FILE="$SCRIPT_DIR/pair.html"

if [ -f "$HTML_FILE" ]; then
    echo "✅ Opening pairing interface..."
    
    # Detect OS and open accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "file://$HTML_FILE"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "file://$HTML_FILE" || firefox "file://$HTML_FILE" || chromium "file://$HTML_FILE"
    fi
else
    echo "❌ pair.html not found!"
    exit 1
fi

echo ""
echo "✨ Bot is starting! The pairing interface will open in your browser."
echo ""
echo "📝 Instructions:"
echo "1. Select your country code"
echo "2. Enter your WhatsApp number"
echo "3. Click \"🔗 Generate Pair Code\""
echo "4. Open WhatsApp → Settings → Linked Devices"
echo "5. Scan the code or enter it manually"
echo "6. Click \"✅ Connect\""
echo "7. 🚀 Bot is now ACTIVE!"
echo ""
echo "ℹ️  To stop the bot: Press Ctrl+C"
echo ""

# Wait for the server process
wait $SERVER_PID
