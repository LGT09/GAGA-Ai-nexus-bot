# GAGA AI WhatsApp Bot - Complete Setup Guide

## 🚀 Quick Start (Web Pairing Method)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure API Keys
```bash
# Copy env template
cp .env.example .env

# Edit .env with your favorite editor and add:
OPENAI_API_KEY=your_openai_key_here
# (Optional) Add other API keys as needed
```

### Step 3: Start Pairing Server
```bash
npm run pair
```

### Step 4: Open Web Interface
- Go to `http://localhost:3000` in your browser
- You'll see the GAGA AI pairing dashboard

### Step 5: Connect Your Bot
1. Select your country
2. Enter your WhatsApp phone number (without country code)
3. Click "Generate Pair Code"
4. A 8-digit code will appear
5. Click "Connect" button
6. Wait for connection confirmation
7. ✅ Bot is live! Check your WhatsApp

---

## 📱 Pairing Web Interface Features

### What Happens During Pairing:

1. **Code Generation** 🔐
   - Secure pair code generated for your number
   - Code is valid for 60 seconds
   - Only works with your WhatsApp number

2. **Connection** 🔗
   - Bot connects to WhatsApp servers
   - Creates encrypted session
   - Stores authentication locally

3. **Welcome Message** 📨
   - Automatic welcome message sent
   - Shows bot status and commands
   - Confirms successful connection

4. **Bot Ready** ✨
   - Auto-reply enabled
   - All commands available
   - Ready to respond to messages

### Connection Log Features:
- Real-time status updates
- Timestamp for each action
- Error messages if issues occur
- Connection history

---

## 🎯 Command Reference

### AI Features
```
!ai [question]           - Chat with GPT-3.5
!imagine [description]   - Generate images with DALL-E
!summarize [text]        - Summarize long text
```

### Info Commands
```
!help                    - Show all commands
!info                    - Bot information
!owner                   - Creator contact details
!ping                    - Check bot status
```

### Entertainment
```
!joke                    - Get random joke
!quote                   - Get inspirational quote
```

### Utilities
```
!weather [city]          - Get weather info
!translate [text] [lang] - Translate text
!calc [expression]       - Calculate math
```

### Auto-Reply (No Prefix!)
Just send a normal message and bot replies:
```
You: Hello!
Bot: Hi there! How can I help you?

You: What's 2+2?
Bot: 2+2 equals 4

You: Tell me a joke
Bot: Why did the chicken cross the road? To get to the other side! 😄
```

---

## 🔌 Server Management

### Pairing Server Commands
```bash
# Start pairing server
npm run pair

# Development mode (auto-reload)
npm run pair:dev
```

### Bot Server Commands
```bash
# Start main bot
npm start

# Development mode
npm run dev
```

### API Endpoints

**Health Check:**
```
GET http://localhost:3000/api/health
```

**Active Sessions:**
```
GET http://localhost:3000/api/sessions
```

**Disconnect Bot:**
```
POST http://localhost:3000/api/disconnect
Body: { "number": "2637168579999" }
```

---

## 🌍 Supported Countries

Countries available in pairing interface:
- India (+91)
- Nigeria (+234)
- USA/Canada (+1)
- UK (+44)
- Pakistan (+92)
- Zimbabwe (+263)
- And 50+ more in extended list

---

## 🔑 API Keys Setup

### Essential: OpenAI API
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

### Optional: Image Generation
1. Stability AI: https://stability.ai
2. HuggingFace: https://huggingface.co
3. Add keys to `.env`

### Optional: Weather
1. OpenWeather: https://openweathermap.org/api
2. Add key to `.env`: `WEATHER_API_KEY=...`

---

## 📧 Creator Information

**Bot Creator:** Vincent Ganiza (Traxxion Gaga)
- **WhatsApp:** +263 716 857 999
- **Call:** +263 780 078 177
- **Email:** traxxiontech@gmail.com
- **Copyright:** © 2026 TRAXXION GAGA

---

## 🐛 Troubleshooting

### Bot Won't Connect
- ✓ Check internet connection
- ✓ Verify phone number is correct
- ✓ Make sure WhatsApp is installed on phone
- ✓ Try generating new pair code

### Pair Code Expires
- Codes valid for 60 seconds
- Generate new code if expired
- Click "Generate Pair Code" again

### Bot Not Responding
- ✓ Check if bot is still connected
- ✓ Verify OpenAI API key is valid
- ✓ Check connection log for errors

### Port Already in Use
```bash
# Change port in pairingServer.js or use:
PORT=3001 npm run pair
```

---

## 📋 Project Structure

```
GAGA Ai nexus bot/
├── index.js              # Main bot file
├── pairingServer.js      # Web pairing server
├── pair.html             # Web interface
├── package.json          # Dependencies
├── .env.example          # Environment template
├── modules/
│   ├── aiService.js      # AI & image generation
│   ├── commands.js       # Command handlers
│   ├── messageHandler.js # Message processing
│   ├── logger.js         # Logging utilities
│   └── utilityService.js # Helper functions
└── README.md             # Documentation
```

---

## 🎨 Features Overview

✅ **AI Powered** - GPT-3.5 integration
✅ **Image Generation** - DALL-E, Stability AI
✅ **Auto-Reply** - Natural conversations
✅ **Web Dashboard** - Beautiful pairing interface
✅ **Multi-language** - English default, translates to others
✅ **Weather Data** - Real-time weather
✅ **Secure** - Encrypted sessions
✅ **Fast** - Quick responses
✅ **Reliable** - Stable connection
✅ **Open Source** - MIT License

---

## 📞 Support

For issues or questions:
- Email: traxxiontech@gmail.com
- WhatsApp: +263 716 857 999
- Open an issue in the repository

---

## 📄 License

MIT License © 2026 TRAXXION GAGA
All rights reserved.

---

**🤖 GAGA AI NEXUS - Your Intelligent WhatsApp Assistant**
**Created by TRAXXION GAGA | Copyright © 2026**
