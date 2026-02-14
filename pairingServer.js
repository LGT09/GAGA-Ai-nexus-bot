import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pino from 'pino'
import dotenv from 'dotenv'
import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers } from '@whiskeysockets/baileys'
import { BotCommands } from './modules/commands.js'
import { MessageHandler } from './modules/messageHandler.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logger = pino({ transport: { target: 'pino-pretty' } })

// Store active connections
const activeSessions = new Map()
const pairingCodes = new Map()

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

// Generate Pair Code
app.get('/api/pair/code', async (req, res) => {
  try {
    const { number } = req.query

    if (!number) {
      return res.status(400).json({ message: 'Phone number is required' })
    }

    logger.info(`Generating pair code for: ${number}`)

    // Create auth directory for this session
    const sessionDir = path.join(__dirname, `auth_${number}`)
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true })
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)

    const sock = makeWASocket({
      auth: state,
      browser: Browsers.ubuntu('Chrome'),
      logger: pino({ level: 'silent' })
    })

    // Get pairing code
    let pairingCode = ''
    
    sock.ev.on('connection.update', (update) => {
      const { connection, pairingCode: code } = update
      
      if (code) {
        pairingCode = code.match(/.{1,4}/g)?.join('-') || code
        logger.info(`Pairing code generated: ${pairingCode}`)
      }
    })

    // Wait for pairing code to be generated (max 30 seconds)
    let attempts = 0
    const codePromise = new Promise((resolve) => {
      const checkCode = setInterval(() => {
        if (pairingCode || attempts > 30) {
          clearInterval(checkCode)
          resolve(pairingCode)
        }
        attempts++
      }, 1000)
    })

    const code = await codePromise

    if (!code) {
      return res.status(500).json({ message: 'Failed to generate pairing code' })
    }

    // Store pairing info with saveCreds
    pairingCodes.set(number, {
      code: code,
      socket: sock,
      sessionDir: sessionDir,
      saveCreds: saveCreds,
      createdAt: Date.now()
    })

    res.json({
      success: true,
      code: code,
      message: 'Pairing code generated successfully'
    })

  } catch (error) {
    logger.error('Error generating pair code:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Connect Bot
app.post('/api/pair/connect', async (req, res) => {
  try {
    const { number, code } = req.body

    if (!number || !code) {
      return res.status(400).json({ message: 'Number and code are required' })
    }

    logger.info(`Attempting to connect bot for: ${number}`)

    const pairingInfo = pairingCodes.get(number)
    if (!pairingInfo) {
      return res.status(404).json({ message: 'Pairing code not found. Please generate a new one.' })
    }

    const { socket: sock, sessionDir } = pairingInfo

    // Setup connection handlers
    let isConnected = false
    let userData = null

    return new Promise((resolve) => {
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (connection === 'open') {
          isConnected = true
          userData = sock.user
          logger.info(`✅ Bot connected as ${userData.id}`)

          try {
            // Initialize bot handlers
            const commandHandler = new BotCommands(CREATOR_INFO, BOT_FOOTER)
            const messageHandler = new MessageHandler(sock, commandHandler, BOT_FOOTER, CREATOR_INFO)

            // Set up message handler for this bot
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

            // Set up credentials update handler
            const { saveCreds } = pairingInfo
            sock.ev.on('creds.update', saveCreds)

            // Send welcome message to the connected number
            const welcomeMessage = `╔══════════════════════════════════╗
🤖 GAGA AI NEXUS - Bot Connected!
✅ Status: Active & Running
👤 Bot Owner: ${CREATOR_INFO.name}
📱 WhatsApp: ${CREATOR_INFO.whatsapp}
📧 Email: ${CREATOR_INFO.email}
©️ ${CREATOR_INFO.copyright}
╚══════════════════════════════════╝

🎉 Your bot is now live and responding!

📝 Commands:
!help - Show all commands
!ai [question] - Chat with AI
!imagine [description] - Generate images
!joke - Get a joke
!weather [city] - Get weather
!owner - Bot creator info

💬 Just type naturally and I'll respond!`

            await sock.sendMessage(number + '@c.us', {
              text: welcomeMessage
            })

            logger.info('Welcome message sent')
          } catch (msgError) {
            logger.warn('Could not send welcome message:', msgError.message)
          }

          // Store active session with message handler running
          activeSessions.set(number, {
            socket: sock,
            sessionDir: sessionDir,
            connectedAt: Date.now(),
            userData: userData,
            isRunning: true
          })

          logger.info(`🚀 Bot is now ACTIVE for: ${number}`)

          resolve(res.json({
            success: true,
            message: 'Bot connected and running successfully!',
            userData: userData,
            welcomeSent: true,
            botStatus: 'ACTIVE'
          }))
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
          
          if (!shouldReconnect) {
            logger.warn('Bot logged out')
            activeSessions.delete(number)
            if (!isConnected) {
              resolve(res.status(500).json({
                success: false,
                message: 'Connection closed without establishing session'
              }))
            }
          }
        }
      })

      // Timeout after 120 seconds
      setTimeout(() => {
        if (!isConnected) {
          logger.error('Connection timeout')
          resolve(res.status(504).json({
            success: false,
            message: 'Connection timeout. Please try again.'
          }))
        }
      }, 120000)
    })

  } catch (error) {
    logger.error('Error connecting bot:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get Active Sessions
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = Array.from(activeSessions.entries()).map(([number, info]) => ({
      number: number,
      connectedAt: new Date(info.connectedAt).toLocaleString(),
      userId: info.userData.id,
      status: 'Active'
    }))

    res.json({
      success: true,
      activeSessions: sessions,
      totalSessions: sessions.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Disconnect Bot
app.post('/api/disconnect', async (req, res) => {
  try {
    const { number } = req.body

    if (!number) {
      return res.status(400).json({ message: 'Phone number is required' })
    }

    const session = activeSessions.get(number)
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    await session.socket.end()
    activeSessions.delete(number)
    
    // Clean up pairing info
    pairingCodes.delete(number)

    logger.info(`Bot disconnected for: ${number}`)

    res.json({
      success: true,
      message: 'Bot disconnected successfully'
    })
  } catch (error) {
    logger.error('Error disconnecting bot:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Pairing Server Running',
    activeBots: activeSessions.size,
    timestamp: new Date().toISOString()
  })
})

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'))
})

function createPairingRouter() {
  const router = express.Router()

  // Middleware for router
  router.use(cors())
  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))
  router.use(express.static(__dirname))

  // Generate Pair Code
  router.get('/api/pair/code', async (req, res) => {
    try {
      const { number } = req.query

      if (!number) {
        return res.status(400).json({ message: 'Phone number is required' })
      }

      logger.info(`Generating pair code for: ${number}`)

      // Create auth directory for this session
      const sessionDir = path.join(__dirname, `auth_${number}`)
      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true })
      }

      const { state, saveCreds } = await useMultiFileAuthState(sessionDir)

      const sock = makeWASocket({
        auth: state,
        browser: Browsers.ubuntu('Chrome'),
        logger: pino({ level: 'silent' })
      })

      // Get pairing code
      let pairingCode = ''
      
      sock.ev.on('connection.update', (update) => {
        const { connection, pairingCode: code } = update
        
        if (code) {
          pairingCode = code.match(/.{1,4}/g)?.join('-') || code
          logger.info(`Pairing code generated: ${pairingCode}`)
        }
      })

      // Wait for pairing code to be generated (max 30 seconds)
      let attempts = 0
      const codePromise = new Promise((resolve) => {
        const checkCode = setInterval(() => {
          if (pairingCode || attempts > 30) {
            clearInterval(checkCode)
            resolve(pairingCode)
          }
          attempts++
        }, 1000)
      })

      const code = await codePromise

      if (!code) {
        return res.status(500).json({ message: 'Failed to generate pairing code' })
      }

      // Store pairing info with saveCreds
      pairingCodes.set(number, {
        code: code,
        socket: sock,
        sessionDir: sessionDir,
        saveCreds: saveCreds,
        createdAt: Date.now()
      })

      res.json({
        success: true,
        code: code,
        message: 'Pairing code generated successfully'
      })

    } catch (error) {
      logger.error('Error generating pair code:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  })

  // Connect Bot
  router.post('/api/pair/connect', async (req, res) => {
    try {
      const { number, code } = req.body

      if (!number || !code) {
        return res.status(400).json({ message: 'Number and code are required' })
      }

      logger.info(`Attempting to connect bot for: ${number}`)

      const pairingInfo = pairingCodes.get(number)
      if (!pairingInfo) {
        return res.status(404).json({ message: 'Pairing code not found. Please generate a new one.' })
      }

      const { socket: sock, sessionDir } = pairingInfo

      // Setup connection handlers
      let isConnected = false
      let userData = null

      return new Promise((resolve) => {
        sock.ev.on('connection.update', async (update) => {
          const { connection, lastDisconnect, qr } = update

          if (connection === 'open') {
            isConnected = true
            userData = sock.user
            logger.info(`✅ Bot connected as ${userData.id}`)

            try {
              // Initialize bot handlers
              const commandHandler = new BotCommands(CREATOR_INFO, BOT_FOOTER)
              const messageHandler = new MessageHandler(sock, commandHandler, BOT_FOOTER, CREATOR_INFO)

              // Set up message handler for this bot
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

              // Set up credentials update handler
              const { saveCreds } = pairingInfo
              sock.ev.on('creds.update', saveCreds)

              // Send welcome message to the connected number
              const welcomeMessage = `╔══════════════════════════════════╗
🤖 GAGA AI NEXUS - Bot Connected!
✅ Status: Active & Running
👤 Bot Owner: ${CREATOR_INFO.name}
📱 WhatsApp: ${CREATOR_INFO.whatsapp}
📧 Email: ${CREATOR_INFO.email}
©️ ${CREATOR_INFO.copyright}
╚══════════════════════════════════╝

🎉 Your bot is now live and responding!

📝 Commands:
!help - Show all commands
!ai [question] - Chat with AI
!imagine [description] - Generate images
!joke - Get a joke
!weather [city] - Get weather
!owner - Bot creator info

💬 Just type naturally and I'll respond!`

              await sock.sendMessage(number + '@c.us', {
                text: welcomeMessage
              })

              logger.info('Welcome message sent')
            } catch (msgError) {
              logger.warn('Could not send welcome message:', msgError.message)
            }

            // Store active session with message handler running
            activeSessions.set(number, {
              socket: sock,
              sessionDir: sessionDir,
              connectedAt: Date.now(),
              userData: userData,
              isRunning: true
            })

            logger.info(`🚀 Bot is now ACTIVE for: ${number}`)

            resolve(res.json({
              success: true,
              message: 'Bot connected and running successfully!',
              userData: userData,
              welcomeSent: true,
              botStatus: 'ACTIVE'
            }))
          }

          if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            
            if (!shouldReconnect) {
              logger.warn('Bot logged out')
              activeSessions.delete(number)
              if (!isConnected) {
                resolve(res.status(500).json({
                  success: false,
                  message: 'Connection closed without establishing session'
                }))
              }
            }
          }
        })

        // Timeout after 120 seconds
        setTimeout(() => {
          if (!isConnected) {
            logger.error('Connection timeout')
            resolve(res.status(504).json({
              success: false,
              message: 'Connection timeout. Please try again.'
            }))
          }
        }, 120000)
      })

    } catch (error) {
      logger.error('Error connecting bot:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  })

  // Get Active Sessions
  router.get('/api/sessions', (req, res) => {
    try {
      const sessions = Array.from(activeSessions.entries()).map(([number, info]) => ({
        number: number,
        connectedAt: new Date(info.connectedAt).toLocaleString(),
        userId: info.userData.id,
        status: 'Active'
      }))

      res.json({
        success: true,
        activeSessions: sessions,
        totalSessions: sessions.length
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  })

  // Disconnect Bot
  router.post('/api/disconnect', async (req, res) => {
    try {
      const { number } = req.body

      if (!number) {
        return res.status(400).json({ message: 'Phone number is required' })
      }

      const session = activeSessions.get(number)
      if (!session) {
        return res.status(404).json({ message: 'Session not found' })
      }

      await session.socket.end()
      activeSessions.delete(number)
      
      // Clean up pairing info
      pairingCodes.delete(number)

      logger.info(`Bot disconnected for: ${number}`)

      res.json({
        success: true,
        message: 'Bot disconnected successfully'
      })
    } catch (error) {
      logger.error('Error disconnecting bot:', error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  })

  // Health Check
  router.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'Pairing Server Running',
      activeBots: activeSessions.size,
      timestamp: new Date().toISOString()
    })
  })

  // Serve HTML root for router
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'))
  })

  return router
}

export default createPairingRouter
