import Gun from 'gun'
import 'gun/sea'
import 'gun/axe'

// Initialize Gun with relay peers
const gun = Gun({
  peers: [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun'
  ],
  localStorage: false, // Disable localStorage for SSR compatibility
  radisk: false
})

// Create user instance
export const user = gun.user()

// Export SEA for encryption
export const SEA = Gun.SEA

// Export gun instance as default
export default gun

// Helper functions for common operations
export const db = {
  // Get data by key
  get: (key: string) => gun.get(key),
  
  // Set data
  set: (key: string, data: any) => gun.get(key).put(data),
  
  // User authentication
  auth: (alias: string, pass: string) => {
    return new Promise((resolve, reject) => {
      user.auth(alias, pass, (ack) => {
        if (ack.err) {
          reject(ack.err)
        } else {
          resolve(ack)
        }
      })
    })
  },
  
  // User registration
  create: (alias: string, pass: string) => {
    return new Promise((resolve, reject) => {
      user.create(alias, pass, (ack) => {
        if (ack.err) {
          reject(ack.err)
        } else {
          resolve(ack)
        }
      })
    })
  }
}
