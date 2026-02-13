import { AIService } from './aiService.js'
import { UtilityService } from './utilityService.js'
import dotenv from 'dotenv'

dotenv.config()

const IMAGE_URL = 'https://d.uguu.se/wzeRyoPa.jpg'

export class BotCommands {
  constructor(creatorInfo, botFooter) {
    this.aiService = new AIService()
    this.utilityService = new UtilityService()
    this.prefix = process.env.BOT_PREFIX || '!'
    this.creatorInfo = creatorInfo
    this.botFooter = botFooter
    this.imageUrl = IMAGE_URL
  }

  async execute(command, args, message) {
    const cmd = command.toLowerCase()

    switch (cmd) {
      case 'help':
        return this.getHelp()
      case 'ai':
        return await this.handleAI(args.join(' '))
      case 'joke':
        return await this.handleJoke()
      case 'quote':
        return await this.handleQuote()
      case 'weather':
        return await this.handleWeather(args[0])
      case 'translate':
        return await this.handleTranslate(args)
      case 'calc':
        return this.handleCalc(args.join(''))
      case 'ping':
        return this.handlePing()
      case 'summarize':
        return await this.handleSummarize(args.join(' '))
      case 'owner':
      case 'creator':
      case 'admin':
        return this.getOwnerInfo()
      case 'imagine':
      case 'image':
      case 'gen':
        return await this.handleImageGeneration(args.join(' '))
      case 'info':
        return this.getBotInfo()
      case 'hello':
        return 'Hey there! 👋 How can I help you today?'
      default:
        return null
    }
  }

  async handleAI(message) {
    if (!message) {
      return 'Please provide a message for AI. Example: `' + this.prefix + 'ai What is the capital of France?`'
    }
    const response = await this.aiService.chat(message)
    return response + this.botFooter
  }

  async handleImageGeneration(prompt) {
    if (!prompt) {
      return 'Please provide a description for the image. Example: `' + this.prefix + 'imagine a beautiful sunset over the ocean`'
    }
    return await this.aiService.generateImage(prompt)
  }

  async handleJoke() {
    const joke = await this.utilityService.getJoke()
    return joke + this.botFooter
  }

  async handleQuote() {
    const quote = await this.utilityService.getQuote()
    return quote + this.botFooter
  }

  async handleWeather(city) {
    if (!city) {
      return 'Please provide a city name. Example: `' + this.prefix + 'weather London`'
    }
    return await this.utilityService.getWeather(city, process.env.WEATHER_API_KEY)
  }

  async handleTranslate(args) {
    if (args.length < 2) {
      return 'Usage: `' + this.prefix + 'translate [text] [language_code]`\nExample: `' + this.prefix + 'translate Hello es`'
    }
    const lang = args[args.length - 1]
    const text = args.slice(0, -1).join(' ')
    return await this.utilityService.translate(text, lang)
  }

  handleCalc(expression) {
    return this.utilityService.calculateExpression(expression)
  }

  handlePing() {
    return `🏓 Pong! Bot is running smoothly.`
  }

  async handleSummarize(text) {
    if (!text) {
      return 'Please provide text to summarize.'
    }
    return await this.aiService.summarize(text)
  }

  getBotInfo() {
    return `*🤖 GAGA AI WhatsApp Bot*\n\n` +
           `📌 Version: 1.0.0\n` +
           `� Created by: ${this.creatorInfo.name}\n` +
           `🛠️ Features: AI Chat, Jokes, Quotes, Weather, Translation, Calculator, Image Generation\n` +
           `🎨 AI Image Generation: Available\n` +
           `⚙️ Status: Active\n` +
           `🌍 Default Language: English\n` +
           `💬 Auto-Reply: Enabled\n\n` +
           `Use *${this.prefix}help* to see available commands.` +
           this.botFooter
  }

  getOwnerInfo() {
    return `*👤 My Creator - Owner Information*\n\n` +
           `🎯 *My daddy or my inventor is Vincent Ganiza*\n` +
           `🌟 *A.K.A: Traxxion Gaga*\n\n` +
           `📱 *WhatsApp:* ${this.creatorInfo.whatsapp}\n` +
           `☎️ *Call:* ${this.creatorInfo.call}\n` +
           `📧 *Email:* ${this.creatorInfo.email}\n\n` +
           `${this.creatorInfo.copyright}` +
           this.botFooter
  }

  getHelp() {
    return `*📚 GAGA AI Bot - Commands Help*\n\n` +
           `${this.prefix}*help* - Show this help message\n` +
           `${this.prefix}*ai [question]* - Chat with AI\n` +
           `${this.prefix}*imagine [description]* - Generate AI image\n` +
           `${this.prefix}*joke* - Get a random joke\n` +
           `${this.prefix}*quote* - Get an inspirational quote\n` +
           `${this.prefix}*weather [city]* - Get weather info\n` +
           `${this.prefix}*translate [text] [lang]* - Translate text\n` +
           `${this.prefix}*calc [expression]* - Calculate math\n` +
           `${this.prefix}*summarize [text]* - Summarize text with AI\n` +
           `${this.prefix}*ping* - Check bot status\n` +
           `${this.prefix}*owner* - Get owner information\n` +
           `${this.prefix}*info* - Bot information\n\n` +
           `💡 *Example:*\n` +
           `${this.prefix}ai What is machine learning?\n` +
           `${this.prefix}imagine a futuristic robot\n` +
           `${this.prefix}weather Tokyo\n` +
           `${this.prefix}translate Hello es\n\n` +
           `🌍 *Default Language:* English\n` +
           `💬 *Auto-Reply:* Enabled (Just chat naturally!)` +
           this.botFooter
  }
}
