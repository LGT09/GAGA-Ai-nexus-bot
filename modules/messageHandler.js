import { Logger } from './logger.js'

export class MessageHandler {
  constructor(sock, commandHandler, botFooter, creatorInfo) {
    this.sock = sock
    this.commandHandler = commandHandler
    this.logger = new Logger()
    this.prefix = process.env.BOT_PREFIX || '!'
    this.cooldowns = new Map()
    this.botFooter = botFooter
    this.creatorInfo = creatorInfo
  }

  async handle(message) {
    try {
      const messageContent = message.message
      if (!messageContent) return

      const text = messageContent.conversation ||
                   messageContent.extendedTextMessage?.text ||
                   messageContent.imageMessage?.caption ||
                   messageContent.videoMessage?.caption ||
                   messageContent.documentMessage?.caption ||
                   ''

      if (!text) return

      const sender = message.key.remoteJid
      const isGroup = sender.includes('@g.us')
      const isFromMe = message.key.fromMe
      const messageId = message.key.id

      // Log message
      this.logger.debug(`Message from ${sender}: ${text.substring(0, 50)}`)

      // Cooldown check
      if (this.isOnCooldown(sender)) {
        return
      }

      // Auto-reply mode: if no prefix, use AI to respond naturally
      if (!text.startsWith(this.prefix)) {
        // Auto-reply using AI for natural conversations
        try {
          const aiResponse = await this.commandHandler.aiService.chat(text)
          if (aiResponse) {
            const finalResponse = aiResponse.includes('GAGA AI NEXUS') ? aiResponse : aiResponse + this.botFooter
            await this.sendMessage(sender, finalResponse, messageId)
          }
        } catch (error) {
          this.logger.debug('Auto-reply error (non-critical):', error.message)
        }
        return
      }

      // Extract command and arguments
      const args = text.slice(this.prefix.length).trim().split(/\s+/)
      const command = args.shift()

      // Execute command
      const response = await this.commandHandler.execute(command, args, message)

      if (response) {
        // Add footer if not already present
        const finalResponse = response.includes('GAGA AI NEXUS') ? response : response + this.botFooter
        await this.sendMessage(sender, finalResponse, messageId)
      }

    } catch (error) {
      this.logger.error('Error in message handler:', error)
    }
  }

  isOnCooldown(sender) {
    if (!this.cooldowns.has(sender)) {
      this.cooldowns.set(sender, Date.now())
      setTimeout(() => this.cooldowns.delete(sender), 1000) // 1 second cooldown
      return false
    }
    return true
  }

  async sendMessage(jid, text, replyTo = null) {
    try {
      const IMAGE_URL = 'https://d.uguu.se/wzeRyoPa.jpg'
      
      // Send image with caption if it's a menu/help/info message
      const isMenuMessage = text.includes('Commands Help') || 
                           text.includes('Bot information') || 
                           text.includes('Creator Information') ||
                           text.includes('Bot is running')
      
      if (isMenuMessage) {
        try {
          // Try to send with image and caption
          await this.sock.sendMessage(jid, {
            image: { url: IMAGE_URL },
            caption: text,
            ...(replyTo && { quoted: { key: { id: replyTo } } })
          })
          return
        } catch (imgError) {
          this.logger.debug('Could not send image, falling back to text only')
        }
      }

      // Standard text message
      const messageData = {
        text: text,
        ...(replyTo && { quoted: { key: { id: replyTo } } })
      }

      await this.sock.sendMessage(jid, messageData)
    } catch (error) {
      this.logger.error('Error sending message:', error.message)
    }
  }

  async sendImage(jid, imageUrl, caption = '') {
    try {
      await this.sock.sendMessage(jid, {
        image: { url: imageUrl },
        caption: caption
      })
    } catch (error) {
      this.logger.error('Error sending image:', error.message)
    }
  }

  async sendDocument(jid, documentUrl, fileName, caption = '') {
    try {
      await this.sock.sendMessage(jid, {
        document: { url: documentUrl },
        fileName: fileName,
        caption: caption
      })
    } catch (error) {
      this.logger.error('Error sending document:', error.message)
    }
  }

  async sendReaction(jid, messageId, emoji) {
    try {
      await this.sock.sendMessage(jid, {
        react: { text: emoji, key: { id: messageId } }
      })
    } catch (error) {
      this.logger.error('Error sending reaction:', error.message)
    }
  }

  async sendTyping(jid) {
    try {
      await this.sock.sendPresenceUpdate('typing', jid)
      setTimeout(() => {
        this.sock.sendPresenceUpdate('available', jid)
      }, 3000)
    } catch (error) {
      this.logger.error('Error sending typing status:', error.message)
    }
  }
}
