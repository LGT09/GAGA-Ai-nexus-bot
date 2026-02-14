export class Logger {
  info(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ℹ️  ${message}`)
  }

  success(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ ${message}`)
  }

  warn(message) {
    console.warn(`[${new Date().toLocaleTimeString()}] ⚠️  ${message}`)
  }

  error(message, error = null) {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ ${message}`)
    if (error) {
      console.error(error)
    }
  }

  debug(message) {
    if (process.env.DEBUG) {
      console.log(`[${new Date().toLocaleTimeString()}] 🐛 ${message}`)
    }
  }
}
