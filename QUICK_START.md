# ⚡ Quick Start (30 seconds)

## 1. Setup (One time only)

### Windows
1. Download and install Node.js: https://nodejs.org/
2. Create a `.env` file in the bot folder with:
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   ```
3. Get your API key from: https://platform.openai.com/

### macOS/Linux
Same as Windows, then make script executable:
```bash
chmod +x start-bot.sh
```

---

## 2. Start Bot (Every time you want to use it)

### Windows
**Double-click:** `START_BOT.bat`

### macOS/Linux
```bash
./start-bot.sh
```

---

## 3. Pair with WhatsApp (First time only)

1. **Browser opens automatically** with pairing interface
2. **Enter your WhatsApp number:**
   - Select country code
   - Enter number without country code
   - Click "🔗 Generate Pair Code"

3. **Open WhatsApp on phone:**
   - Settings → Linked Devices → Link a Device
   - Scan code or enter manually

4. **Click "✅ Connect"** in browser
5. **Bot is now ACTIVE!** 🚀

---

## 4. Use the Bot

Send messages to your WhatsApp number:
```
!help           → See all commands
!ai hello       → Chat with AI
!joke           → Get a joke
!weather NYC    → Get weather
!imagine cat    → Generate images
```

---

## 📞 Issues?

- **"Server Not Running"** → Close and re-run START_BOT.bat
- **"Pair Code Doesn't Work"** → Generate a new one, use within 2 minutes
- **"Bot Doesn't Respond"** → Check OPENAI_API_KEY in .env

---

**That's it! Enjoy your GAGA AI Bot!** 🎉

For detailed docs, see: `STANDALONE_SETUP.md`
