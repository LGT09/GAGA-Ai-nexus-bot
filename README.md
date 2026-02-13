# GAGA AI WhatsApp Bot

**Created by: TRAXXION GAGA**  
**Copyright © 2026**

A multipurpose AI-powered WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys) and Node.js. This bot provides various features including AI chat, jokes, weather, translation, and more.

## Features

✨ **Core Features:**
- 🤖 **AI Chat** - Chat with OpenAI's GPT-3.5
- � **Auto-Reply** - Responds to messages without prefix using AI
- 🎨 **AI Image Generation** - Generate images using DALL-E, Stability AI, and more
- 😄 **Jokes** - Get random jokes
- 💡 **Quotes** - Inspirational quotes
- 🌍 **Weather** - Real-time weather information
- 🌐 **Translation** - Translate text to multiple languages
- 🧮 **Calculator** - Basic math calculations
- 📝 **Text Summarization** - Summarize long texts with AI
- 🏓 **Ping** - Check bot status
- 📱 **Group & Private Chat Support**
- 🌍 **Default Language** - English (but responds in user's language)
- ⚡ **Fast & Reliable**

## Image Generation Capabilities

🎨 **Supported Image Generation APIs:**
- **OpenAI DALL-E** - Premium, high-quality images
- **Stability AI** - Fast and reliable image generation
- **HuggingFace** - Open-source models
- **Unsplash API** - Free stock photos
- **Pixabay API** - Free stock images
- **Pexels API** - Free stock photos

Usage: `!imagine [description]` or `!image [description]` or `!gen [description]`
Example: `!imagine a futuristic robot in a cyberpunk city`

## Installation & Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- WhatsApp account

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API keys
```

Edit `.env` file and configure:
```
BOT_NAME=GAGA AI Bot
BOT_PREFIX=!
OPENAI_API_KEY=your_openai_api_key_here
STABILITY_API_KEY=your_stability_api_key_here
WEATHER_API_KEY=your_openweather_api_key_here
BOT_LANGUAGE=English
ENABLE_AUTO_REPLY=true
ENABLE_IMAGE_GEN=true
```

### Two Ways to Connect the Bot

#### Method 1: Web Pairing Interface (Recommended)

1. **Start the Pairing Server**
```bash
npm run pair
```

2. **Open Browser**
- Go to `http://localhost:3000`
- You'll see the GAGA AI pairing interface

3. **Generate Pair Code**
- Select your country
- Enter your WhatsApp phone number
- Click "Generate Pair Code"

4. **Connect Bot**
- A 8-digit code will appear
- Click "Connect" button
- Bot will automatically pair and send connection message
- ✅ Bot is now live and running!

#### Method 2: QR Code Scanner (Traditional)

1. **Start the Bot**
```bash
npm start
```

2. **Scan QR Code**
- A QR code will appear in terminal
- Scan with your WhatsApp phone
- Bot will connect automatically

### Obtaining API Keys

**OpenAI API Key (for AI Chat & DALL-E Images):**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

**Stability AI API Key (for Image Generation):**
1. Visit [Stability AI](https://stability.ai)
2. Sign up and get API key
3. Add it to your `.env` file as `STABILITY_API_KEY`

**OpenWeather API Key (Optional - for Weather):**
1. Visit [OpenWeather](https://openweathermap.org/api)
2. Sign up and get a free API key
3. Add it to your `.env` file as `WEATHER_API_KEY`

**Free Image APIs (No Key Required):**
- Unsplash: https://unsplash.com/api
- Pixabay: https://pixabay.com/api
- Pexels: https://www.pexels.com/api

## Web Pairing Interface

The bot now includes a beautiful web interface for easy pairing:

### Features:
- 🎨 **Modern 3D UI** - Glassmorphic design with 3D effects
- 🌍 **Multiple Countries** - Support for 50+ countries
- 🔒 **Secure Pairing** - Safe connection to WhatsApp
- 📊 **Connection Log** - Real-time status updates
- ⚡ **Fast & Reliable** - Quick pairing process
- 🌓 **Dark/Light Theme** - Toggle theme support

### Web Interface URLs:
- Pairing: `http://localhost:3000`
- API Health: `http://localhost:3000/api/health`
- Active Sessions: `http://localhost:3000/api/sessions`

## Usage

### Start the Pairing Server
```bash
npm run pair
```

### Development Mode (with auto-reload)
```bash
npm run pair:dev
```

### Start the Bot (Traditional Method)
```bash
npm start
```

### Bot Commands

#### AI Chat Commands
- `!ai [question]` - Chat with AI about any topic
- `!imagine [description]` - Generate images with AI
- `!summarize [text]` - Summarize long texts

#### Auto-Reply (No Prefix Needed)
Just type naturally and the bot will respond using AI:
```
User: Hello, how are you?
Bot: Hi! I'm doing great, thanks for asking!
```

#### Other Commands
- `!help` - Show all available commands with menu image
- `!info` - Bot information with menu image
- `!owner` - Creator contact information
- `!joke` - Get a random joke
- `!quote` - Get an inspirational quote
- `!weather [city]` - Get weather information
- `!translate [text] [language]` - Translate text
- `!calc [expression]` - Calculate math expressions
- `!ping` - Check bot status
4. Bot will be connected!

## Commands

Use the prefix `!` (customizable in .env) to execute commands:

| Command | Usage | Description |
|---------|-------|-------------|
| `!help` | `!help` | Show all available commands |
| `!ai` | `!ai What is AI?` | Chat with AI |
| `!joke` | `!joke` | Get a random joke |
| `!quote` | `!quote` | Get an inspirational quote |
| `!weather` | `!weather London` | Get weather for a city |
| `!translate` | `!translate Hello es` | Translate text (last arg is language code) |
| `!calc` | `!calc 2+2*3` | Calculate math expressions |
| `!summarize` | `!summarize [long text]` | Summarize text with AI |
| `!ping` | `!ping` | Check bot status |
| `!info` | `!info` | Bot information |

## Example Usage

```
User: !ai What is machine learning?
Bot: Machine learning is a subset of artificial intelligence...

User: !joke
Bot: Why don't scientists trust atoms? Because they make up everything!

User: !weather Tokyo
Bot: 🌍 Weather in Tokyo, JP
    📊 Temperature: 15°C
    💨 Feels like: 12°C
    🌤️ Condition: Cloudy
    💧 Humidity: 65%
    🌪️ Wind Speed: 3.5 m/s

User: !translate Hello es
Bot: Hola
```

## Project Structure

```
GAGA Ai nexus bot/
├── index.js                 # Main bot file
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .env                    # Environment variables (create from .env.example)
├── auth_info/              # WhatsApp session data (auto-generated)
└── modules/
    ├── commands.js         # Command handler
    ├── messageHandler.js   # Message processing
    ├── aiService.js        # AI features
    ├── utilityService.js   # Utility features
    └── logger.js           # Logging utility
```

## Architecture

### Message Flow
1. **Message Arrives** → Baileys detects it
2. **Message Handler** → Processes message content
3. **Command Parser** → Extracts command and arguments
4. **Command Executor** → Runs appropriate command
5. **Service Layer** → Calls AI/utility services
6. **Response** → Sends message back to user

## Security Notes

⚠️ **Important:**
- Never share your `.env` file or API keys
- Keep your `auth_info/` folder secure (contains session data)
- Don't use admin account for bot (recommended)
- Add admin verification for sensitive commands

## Troubleshooting

### QR Code Not Appearing
```bash
# Make sure terminal supports Unicode
# Try running in a different terminal
```

### Connection Timeout
```bash
# Check your internet connection
# Restart the bot
npm start
```

### AI Responses Not Working
- Check if `OPENAI_API_KEY` is set in `.env`
- Verify API key is valid
- Check API usage and credits

### Weather Not Working
- Check if `WEATHER_API_KEY` is set in `.env`
- Verify city name spelling
- Check API rate limits

## Advanced Features

### Adding Custom Commands
Edit `modules/commands.js` and add new case in the `execute()` method:

```javascript
case 'yourcommand':
  return await this.handleYourCommand(args)
```

### Custom Responses
Modify response messages in `modules/commands.js` to add emojis or customize text.

### Group Management
The bot automatically detects group messages. Add group-specific logic in `messageHandler.js`.

## Creator & Owner Information

**Name:** Vincent Ganiza (Traxxion Gaga)  
**WhatsApp:** 263716857999  
**Call:** 263780078177  
**Email:** traxxiontech@gmail.com  
**Copyright:** TRAXXION GAGA © 2026

---

## Future Enhancements

- [ ] Database integration for user preferences
- [ ] Command scheduling
- [ ] Media download capability
- [ ] Admin commands for group management
- [ ] Conversation history
- [ ] Multi-language support
- [ ] Premium features
- [ ] Web dashboard for analytics

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

MIT License - feel free to use this bot for personal and commercial projects.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

For inquiries about the bot, contact the creator:
- **WhatsApp:** +263 716 857 999
- **Call:** +263 780 078 177
- **Email:** traxxiontech@gmail.com

## Disclaimer

This bot uses Baileys library which is an unofficial WhatsApp API. Use responsibly and in compliance with WhatsApp's terms of service. The authors are not responsible for any misuse.

---

**🤖 GAGA AI NEXUS by TRAXXION GAGA**  
**©️ Copyright 2026**

**Made with ❤️ by GAGA AI Team**
