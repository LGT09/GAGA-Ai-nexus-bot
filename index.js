import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState, 
  Browsers 
} from '@whiskeysockets/baileys'
import pino from 'pino'
import QRCode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { BotCommands } from './modules/commands.js'
import { MessageHandler } from './modules/messageHandler.js'
import { Logger } from './modules/logger.js'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import createPairingRouter from './pairingServer.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logger = new Logger()

// Creator Information
const CREATOR_INFO = {
  name: 'Vincent Ganiza (Traxxion Gaga)',
  whatsapp: '263716857999',
  call: '263780078177',
  email: 'traxxiontech@gmail.com',
  copyright: 'TRAXXION GAGA Copyright © 2026'
}

const BOT_FOOTER = `
╔══════════════════════════════════╗
🤖 GAGA AI NEXUS by TRAXXION GAGA
©️ Copyright 2026
╚══════════════════════════════════╝`

// --- HTTP pairing server (serves pairing UI & pairing APIs) ---
const app = express()
const HTTP_PORT = process.env.HTTP_PORT || process.env.PORT || 8000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname))

app.use('/pair', createPairingRouter())

app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'))
})

app.listen(HTTP_PORT, () => {
  logger.info(`HTTP server running on http://localhost:${HTTP_PORT}`)
})

// Check if credentials exist in any of the auth directories
function findCredentials() {
  const baseDir = __dirname
  const dirs = fs.readdirSync(baseDir).filter(file => {
    return fs.statSync(path.join(baseDir, file)).isDirectory() && file.startsWith('auth_')
  })
  
  if (dirs.length > 0) {
    return path.join(baseDir, dirs[0])
  }
  
  // Check for legacy auth_info directory
  const legacyDir = path.join(baseDir, 'auth_info')
  if (fs.existsSync(legacyDir) && fs.readdirSync(legacyDir).length > 0) {
    return legacyDir
  }
  
  return null
}

async function startBot() {
  try {
    logger.info('🚀 Starting WhatsApp Bot...')
    logger.info(`👤 Created by: ${CREATOR_INFO.name}`)
    logger.info(`📅 ${CREATOR_INFO.copyright}`)
    
    // Check for existing paired credentials
    const credDir = findCredentials()
    
    if (!credDir) {
      logger.warn('⚠️  No paired credentials found!')
      logger.info('📱 To pair your bot:')
      logger.info('1. Run: npm run pair')
      logger.info('2. Open: http://localhost:3000')
      logger.info('3. Enter your WhatsApp number')
      logger.info('4. Enter the pairing code on WhatsApp')
      logger.info('5. Bot will start automatically!')
      return
    }
    
    logger.info(`✅ Found credentials at: ${credDir}`)
    const { state, saveCreds } = await useMultiFileAuthState(credDir)

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      markOnlineOnConnect: true,
      shouldIgnoreJid: (jid) => jid.includes('broadcast')
    })

    // Initialize command handler with creator info and footer
    const commandHandler = new BotCommands(CREATOR_INFO, BOT_FOOTER)
    const messageHandler = new MessageHandler(sock, commandHandler, BOT_FOOTER, CREATOR_INFO)

    // Connection update handler
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update
      
      if (qr) {
        logger.info('📱 Scan this QR code to connect:')
        QRCode.generate(qr, { small: true })
      }
      
      if (connection === 'connecting') {
        logger.info('🔄 Connecting to WhatsApp...')
      }
      
      if (connection === 'open') {
        logger.success('✅ Bot connected successfully!')
        logger.info(`Bot JID: ${sock.user?.id}`)
        logger.info(`🎉 ${CREATOR_INFO.copyright}`)
      }
      
      if (connection === 'close') {
        if ((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
          logger.error('❌ Connection closed. Reconnecting...')
          setTimeout(() => startBot(), 5000)
        } else {
          logger.warn('⚠️ Bot logged out')
          process.exit()
        }
      }
    })

    // Credentials update handler
    sock.ev.on('creds.update', saveCreds)

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const msg of messages) {
          try {
            await messageHandler.handle(msg)
          } catch (error) {
            logger.error('Error handling message:', error)
          }
        }
      }
    })

    // Group update handler
    sock.ev.on('groups.update', (updates) => {
      logger.info(`Group update: ${JSON.stringify(updates)}`)
    })

    // Presence update handler
    sock.ev.on('presence.update', (update) => {
      // logger.debug(`Presence update: ${JSON.stringify(update)}`)
    })

    logger.info('✨ Bot is ready to handle messages')

  } catch (error) {
    logger.error('Failed to start bot:', error)
    setTimeout(() => startBot(), 5000)
  }
}

startBot().catch(error => {
  logger.error('Fatal error:', error)
  process.exit(1)
})
