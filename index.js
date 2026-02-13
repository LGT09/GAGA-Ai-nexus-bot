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

async function startBot() {
  try {
    logger.info('🚀 Starting WhatsApp Bot...')
    logger.info(`👤 Created by: ${CREATOR_INFO.name}`)
    logger.info(`📅 ${CREATOR_INFO.copyright}`)
    
    // Create auth directory if it doesn't exist
    const authDir = path.join(__dirname, 'auth_info')
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true })
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir)

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
