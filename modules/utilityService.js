import axios from 'axios'

export class UtilityService {
  async getJoke() {
    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/jokes?limit=1', {
        headers: { 'X-Api-Key': 'FREE_API' }
      })
      return response.data[0]?.joke || '😄 Could not fetch a joke at the moment.'
    } catch (error) {
      // Fallback jokes
      const jokes = [
        'Why don\'t scientists trust atoms? Because they make up everything!',
        'Did you hear about the mathematician who\'s afraid of negative numbers? He\'ll stop at nothing to avoid them!',
        'Why did the scarecrow win an award? He was outstanding in his field!'
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
  }

  async getQuote() {
    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/quotes?limit=1', {
        headers: { 'X-Api-Key': 'FREE_API' }
      })
      const quote = response.data[0]
      return `*"${quote.quote}"*\n— ${quote.author}`
    } catch (error) {
      const quotes = [
        { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
        { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' }
      ]
      const q = quotes[Math.floor(Math.random() * quotes.length)]
      return `*"${q.text}"*\n— ${q.author}`
    }
  }

  async getWeather(city, apiKey) {
    if (!apiKey) {
      return '🌡️ Weather API key not configured.'
    }

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      })

      const data = response.data
      const weather = data.weather[0]
      
      return `🌍 *Weather in ${data.name}, ${data.sys.country}*\n` +
             `📊 Temperature: ${data.main.temp}°C\n` +
             `💨 Feels like: ${data.main.feels_like}°C\n` +
             `🌤️ Condition: ${weather.main} - ${weather.description}\n` +
             `💧 Humidity: ${data.main.humidity}%\n` +
             `🌪️ Wind Speed: ${data.wind.speed} m/s`
    } catch (error) {
      return `❌ Could not fetch weather for "${city}". Please check the city name.`
    }
  }

  async translate(text, targetLang = 'en') {
    try {
      const response = await axios.post('https://api.mymemory.translated.net/get', {
        q: text,
        langpair: `auto|${targetLang}`
      })

      if (response.data.responseStatus === 200) {
        return `🌐 *Translation:*\n${response.data.responseData.translatedText}`
      }
      return '⚠️ Translation service temporarily unavailable.'
    } catch (error) {
      return '❌ Could not translate the text.'
    }
  }

  generateQRCode(text) {
    // This would require a QR code generation library
    return 'QR code generation would require image processing library'
  }

  calculateExpression(expression) {
    try {
      // Simple calculator for basic math expressions
      const result = Function('"use strict"; return (' + expression + ')')()
      return `🧮 Result: ${result}`
    } catch (error) {
      return '❌ Invalid mathematical expression.'
    }
  }

  formatText(text, style = 'bold') {
    switch(style) {
      case 'bold':
        return `*${text}*`
      case 'italic':
        return `_${text}_`
      case 'strikethrough':
        return `~${text}~`
      case 'code':
        return `\`\`\`${text}\`\`\``
      default:
        return text
    }
  }
}
