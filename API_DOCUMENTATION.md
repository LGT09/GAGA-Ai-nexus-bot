# GAGA AI Bot - API Documentation

## Pairing Server API

Base URL: `http://localhost:3000`

---

## Endpoints

### 1. Generate Pair Code
**Generate a pairing code for a WhatsApp number**

```
GET /api/pair/code?number=<phone_number>
```

**Parameters:**
- `number` (required) - Full phone number with country code (e.g., "263716857999")

**Response:**
```json
{
  "success": true,
  "code": "1234-5678",
  "message": "Pairing code generated successfully"
}
```

**Example:**
```bash
curl "http://localhost:3000/api/pair/code?number=263716857999"
```

---

### 2. Connect Bot
**Connect bot to WhatsApp using pairing code**

```
POST /api/pair/connect
```

**Request Body:**
```json
{
  "number": "263716857999",
  "code": "1234-5678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bot connected successfully!",
  "userData": {
    "id": "263716857999@s.whatsapp.net",
    "name": "GAGA AI Bot"
  },
  "welcomeSent": true
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/pair/connect \
  -H "Content-Type: application/json" \
  -d '{"number":"263716857999","code":"1234-5678"}'
```

---

### 3. Get Active Sessions
**Get list of all active bot sessions**

```
GET /api/sessions
```

**Response:**
```json
{
  "success": true,
  "activeSessions": [
    {
      "number": "263716857999",
      "connectedAt": "2/16/2026, 10:30:45 AM",
      "userId": "263716857999@s.whatsapp.net",
      "status": "Active"
    }
  ],
  "totalSessions": 1
}
```

**Example:**
```bash
curl http://localhost:3000/api/sessions
```

---

### 4. Disconnect Bot
**Disconnect a bot session**

```
POST /api/disconnect
```

**Request Body:**
```json
{
  "number": "263716857999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bot disconnected successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/disconnect \
  -H "Content-Type: application/json" \
  -d '{"number":"263716857999"}'
```

---

### 5. Health Check
**Check if pairing server is running**

```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "status": "Pairing Server Running",
  "activeBots": 1,
  "timestamp": "2026-02-16T10:30:45.123Z"
}
```

**Example:**
```bash
curl http://localhost:3000/api/health
```

---

### 6. Serve Pairing Interface
**Get the web pairing interface**

```
GET /
```

**Response:** HTML file of the pairing interface

**Example:**
```
Open http://localhost:3000 in browser
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Phone number is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Pairing code not found. Please generate a new one."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to generate pairing code"
}
```

### 504 Gateway Timeout
```json
{
  "success": false,
  "message": "Connection timeout. Please try again."
}
```

---

## Phone Number Format

### Valid Formats:
- Country code + number without spaces: `263716857999`
- With plus sign (optional): `+263716857999`
- DO NOT include: `+`, `-`, `(`, `)`, or spaces in API calls

### Examples:
```
India:        91XXXXXXXXXX
Nigeria:      234XXXXXXXXXX
USA/Canada:   1XXXXXXXXXX
UK:           44XXXXXXXXXX
Pakistan:     92XXXXXXXXXX
Zimbabwe:     263XXXXXXXXXX
```

---

## Pairing Code Format

Pairing codes are:
- 8 digits (displayed as XXXX-XXXX)
- Valid for 60 seconds
- Single use only
- Specific to each phone number
- Case-insensitive

---

## Session Management

### Session Storage
- Sessions stored in memory during server runtime
- Sessions persist until bot is disconnected
- Multiple bots can run simultaneously
- Each bot has isolated session

### Session Data
```javascript
{
  number: "263716857999",
  socket: WebSocket,           // WhatsApp connection
  sessionDir: "./auth_263716857999",
  connectedAt: 1708069445123,
  userData: {
    id: "263716857999@s.whatsapp.net",
    name: "GAGA AI Bot"
  }
}
```

---

## CORS Policy

**Allowed Origins:**
- `http://localhost:*`
- `http://127.0.0.1:*`
- Any origin (development)

**Allowed Methods:**
- GET
- POST
- PUT
- DELETE
- OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization

---

## Rate Limiting

Currently no rate limiting implemented. For production:
- Implement rate limiting (max 10 requests/minute per IP)
- Add request validation
- Implement HTTPS
- Add authentication tokens

---

## WebSocket Connection

The pairing server creates WebSocket connections to WhatsApp servers.

**Connection Details:**
```javascript
{
  browser: Browsers.ubuntu('Chrome'),
  printQRInTerminal: true,
  logger: pino({ level: 'silent' })
}
```

**Connection States:**
- `connecting` - Establishing connection
- `open` - Connected and ready
- `close` - Disconnected

---

## Bot Messages

### Welcome Message
Sent automatically when bot connects:
```
╔══════════════════════════════════╗
🤖 GAGA AI NEXUS - Bot Connected!
✅ Status: Active & Running
👤 Bot Owner: Vincent Ganiza (Traxxion Gaga)
📱 WhatsApp: +263 716 857 999
📧 Email: traxxiontech@gmail.com
©️ TRAXXION GAGA Copyright © 2026
╚══════════════════════════════════╝

🎉 Your bot is now live and responding!

📝 Commands:
!help - Show all commands
!ai [question] - Chat with AI
!imagine [description] - Generate images
!joke - Get a joke
!weather [city] - Get weather
!owner - Bot creator info

💬 Just type naturally and I'll respond!
```

---

## Example Usage Flow

### 1. User Generates Pair Code
```bash
GET /api/pair/code?number=263716857999
```
Response: `{"code": "1234-5678"}`

### 2. User Enters Code in WhatsApp
- Open WhatsApp on phone
- Settings → Linked Devices
- Enter code: 1234-5678

### 3. Server Confirms Connection
```bash
POST /api/pair/connect
```
Response: `{"success": true}`

### 4. Bot Sends Welcome Message
- Message appears in WhatsApp chat
- Shows all available commands
- Bot is ready to respond

### 5. User Tests Bot
```
User: !help
Bot: [Shows all commands with bot image]

User: Hello
Bot: Hi there! How can I help you? [Auto-reply]

User: !ai What is AI?
Bot: AI stands for Artificial Intelligence...
```

---

## Environment Variables

### Required
```
OPENAI_API_KEY=sk-...
```

### Optional
```
STABILITY_API_KEY=...
WEATHER_API_KEY=...
HUGGINGFACE_API_KEY=...
UNSPLASH_API_KEY=...
PIXABAY_API_KEY=...
```

### Bot Settings
```
BOT_NAME=GAGA AI Bot
BOT_PREFIX=!
BOT_LANGUAGE=English
PORT=3000
```

---

## Debugging

### Enable Verbose Logging
Edit `pairingServer.js`:
```javascript
logger: pino({ level: 'debug' })  // Instead of 'silent'
```

### Monitor Active Connections
```bash
curl http://localhost:3000/api/sessions | jq
```

### Check Server Health
```bash
curl http://localhost:3000/api/health | jq
```

### View Connection Logs
- Open browser console (F12)
- Check "Connection Log" section on pairing page

---

## Security Considerations

⚠️ **Important:**
1. Never share pairing codes publicly
2. Keep API keys private (use `.env`)
3. Use HTTPS in production
4. Implement authentication for API endpoints
5. Add rate limiting for production use
6. Validate all user inputs
7. Use secure session storage

---

## Version Information

**API Version:** 1.0.0
**Bot Version:** 1.0.0
**Baileys Version:** ^6.4.0
**Node.js:** >=16.0.0

---

## Support

For API issues:
- Email: traxxiontech@gmail.com
- WhatsApp: +263 716 857 999
- Repository issues

---

**🤖 GAGA AI NEXUS API**
**Created by TRAXXION GAGA | Copyright © 2026**
