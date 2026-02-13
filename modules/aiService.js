import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY
    this.imageGenerationAPIs = [
      {
        name: 'OpenAI DALL-E',
        endpoint: 'https://api.openai.com/v1/images/generations',
        requiresKey: true
      },
      {
        name: 'Stability AI',
        endpoint: 'https://api.stability.ai/v1/generate',
        requiresKey: true
      },
      {
        name: 'HuggingFace',
        endpoint: 'https://huggingface.co/api/models',
        requiresKey: false
      }
    ]
  }

  async chat(message) {
    if (!this.openaiApiKey) {
      return '🤖 AI service not configured. Please set OPENAI_API_KEY in .env file'
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful and friendly WhatsApp assistant. Keep responses concise and useful. Default language is English. Respond in the same language as the user, but prefer English.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('AI Service error:', error.response?.data || error.message)
      return '⚠️ Could not process your request at the moment. Please try again later.'
    }
  }

  async generateImage(prompt) {
    if (!this.openaiApiKey) {
      return `🎨 *Image Generation Available*\n\n` +
             `Available Image Generation APIs:\n` +
             `1. OpenAI DALL-E (Requires API Key)\n` +
             `2. Stability AI (Requires API Key)\n` +
             `3. HuggingFace (Free)\n` +
             `4. Unsplash API (Free)\n` +
             `5. Pixabay API (Free)\n\n` +
             `🔌 Setup: Add your API keys to .env file\n` +
             `📝 Prompt: "${prompt}"\n\n` +
             `Your image generation request: ${prompt}\n\n` +
             `To enable image generation, add API keys to .env:\n` +
             `OPENAI_API_KEY=your_key\n` +
             `STABILITY_API_KEY=your_key\n` +
             `HUGGINGFACE_API_KEY=your_key`
    }

    try {
      // Try OpenAI DALL-E
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt: prompt,
          n: 1,
          size: '512x512',
          quality: 'standard'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const imageUrl = response.data.data[0].url
      return `🎨 *Image Generated Successfully*\n\n` +
             `📝 Prompt: ${prompt}\n` +
             `🔗 Image URL: ${imageUrl}\n\n` +
             `✨ Generated with OpenAI DALL-E\n` +
             `💾 Right-click to save the image`
    } catch (error) {
      console.error('Image generation error:', error.response?.data || error.message)
      
      // Provide fallback information
      return `🎨 *Image Generation Request*\n\n` +
             `📝 Prompt: ${prompt}\n\n` +
             `Available Free Image APIs:\n` +
             `• Unsplash: https://api.unsplash.com\n` +
             `• Pixabay: https://pixabay.com/api\n` +
             `• Pexels: https://api.pexels.com\n` +
             `• Lorem Picsum: https://picsum.photos\n\n` +
             `Premium APIs:\n` +
             `• OpenAI DALL-E: https://api.openai.com\n` +
             `• Stability AI: https://api.stability.ai\n` +
             `• Midjourney: https://midjourney.com\n\n` +
             `💡 Add API keys to .env to enable image generation`
    }
  }

  async summarize(text) {
    if (!this.openaiApiKey) {
      return '🤖 AI service not configured.'
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Please summarize this text concisely:\n\n${text}`
            }
          ],
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Summarize error:', error.message)
      return '⚠️ Could not summarize the text.'
    }
  }
}
