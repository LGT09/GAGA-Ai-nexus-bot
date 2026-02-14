# 🔗 WhatsApp Bot Pairing Guide

## Overview
The GAGA AI Nexus Bot uses **Baileys Pairing Code** method to securely connect to WhatsApp. This guide explains the complete pairing workflow.

---

## 🚀 Quick Start

### Step 1: Start the Pairing Server
```bash
npm run pair
```

The pairing server will start on **http://localhost:3000**

### Step 2: Open Pairing Interface
Open your browser and go to:
```
http://localhost:3000
```

You should see the GAGA AI Nexus pairing interface.

### Step 3: Enter Your WhatsApp Number
1. Select your country code from the dropdown
2. Enter your WhatsApp phone number (without country code)
3. Click **"🔗 Generate Pair Code"**

### Step 4: Pair with WhatsApp
1. Open WhatsApp on your phone
2. Go to **Settings → Linked Devices → Link a Device**
3. Scan the QR code shown on the pairing interface, OR
4. Enter the **pair code** displayed on the screen (in format: `XXXX-XXXX-XXXX`)

### Step 5: Connect the Bot
1. Once paired, click the **"✅ Connect"** button
2. The bot will be connected and start running
3. A welcome message will be sent to the WhatsApp number
4. Bot is now **ACTIVE** and ready to receive messages!

---

## 📁 Directory Structure

### Auth Directories
When you pair a bot with a phone number, credentials are stored in:
```
auth_{country_code}{phone_number}/
├── creds.json          # Main credentials
├── pre-keys/           # Encryption keys
├── session-*           # Session data
└── app-state-sync-*    # WhatsApp state
```

**Example:**
```
auth_263716857999/      # For Zimbabwe number +263 716 857999
```

### Legacy Support
If you have old credentials in `auth_info/`, they will still work but will be migrated to the new structure on next connection.

---

## 🔄 Connection Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User opens http://localhost:3000                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Enter WhatsApp number & click "Generate Pair Code"   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Backend creates temporary socket & gets pair code    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Pair code displayed (user enters in WhatsApp)        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Click "✅ Connect" button                             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Server waits for WhatsApp connection confirmation   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Credentials saved to auth_{number}/                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Session stored & welcome message sent                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Bot is ACTIVE and listening for messages             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Running the Bot After Pairing

Once paired, you have two options:

### Option A: Start Bot Directly (Recommended)
```bash
npm start
```

This will:
- Check for existing paired credentials
- Automatically reconnect using stored credentials
- Start responding to messages immediately
- No need to pair again!

### Option B: Run in Development Mode
```bash
npm run dev
```

Same as above but with auto-restart on file changes (good for development).

### Option C: Re-pair or Add New Number
```bash
npm run pair
```

Starts the pairing server to pair a new WhatsApp number.

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# OpenAI API Key (for AI features)
OPENAI_API_KEY=sk-proj-your-api-key-here

# Server Port (optional, defaults to 3000)
PORT=3000

# Debug Mode (optional)
DEBUG=false
```

---

## 🔒 Security Notes

### Credential Files
- **NEVER commit `auth_*` directories to git**
- They contain sensitive WhatsApp credentials
- `.gitignore` already excludes them
- Back them up safely if needed

### API Keys
- **NEVER hardcode API keys in code**
- Always use `.env` file
- Check `.env` is in `.gitignore`

### Rate Limiting
- Baileys respects WhatsApp rate limits
- Bot will pause if sending too many messages
- No additional configuration needed

---

## 🐛 Troubleshooting

### "No paired credentials found"
**Solution:** Run the pairing server:
```bash
npm run pair
```

### Pair Code Doesn't Work
1. Make sure you're entering the code within 2 minutes
2. Try generating a new code
3. Check your internet connection
4. Ensure WhatsApp is up to date

### "Connection timeout"
- **Cause:** WhatsApp didn't respond within 120 seconds
- **Solution:** Click "Generate Pair Code" again and try connecting

### Bot Not Responding
1. Check if bot is running: `npm start`
2. Verify credentials exist: `ls auth_*/`
3. Check API key in `.env`: `echo $OPENAI_API_KEY`
4. Look at logs for error messages

### Multiple Bots on Same Number
❌ **Not recommended** - WhatsApp only allows one connection per number
✅ **Use different numbers** for different bots

---

## 📊 Multiple Bot Management

### Pair Multiple Numbers
1. Run pairing server: `npm run pair`
2. Pair first number (e.g., +263716857999)
3. In another terminal, keep pairing server running
4. Pair second number (e.g., +234123456789)
5. Credentials saved to separate `auth_*` directories

### Starting Multiple Bots
Create separate instances or use process manager:

```bash
# Terminal 1
node index.js  # Loads first paired credentials

# Terminal 2
# Copy auth directory and modify index.js to use it
CRED_DIR=auth_234123456789 node index.js
```

---

## 🎨 Customization

### Branding
Edit `pairingServer.js` and `index.js`:
```javascript
const CREATOR_INFO = {
  name: 'Your Name',
  whatsapp: 'Your WhatsApp',
  email: 'your@email.com',
  copyright: 'Your Copyright'
}
```

### Custom Welcome Message
Edit `pairingServer.js` - search for `welcomeMessage` variable

### UI Customization
Edit `pair.html` - the CSS is all in the `<style>` tag

---

## 📞 Support

For issues or questions:
- **Email:** traxxiontech@gmail.com
- **WhatsApp:** 263716857999
- **Creator:** Vincent Ganiza (Traxxion Gaga)

---

## ✅ Verification Checklist

After pairing, verify:
- [ ] Credentials exist in `auth_*/` directory
- [ ] `.env` file has `OPENAI_API_KEY`
- [ ] Bot logs show "✅ Bot connected successfully!"
- [ ] Welcome message received on WhatsApp
- [ ] Bot responds to messages with `!help` command

---

**© 2026 TRAXXION GAGA - All Rights Reserved**
