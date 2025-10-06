// gundb/client.js
import Gun from 'gun'
import 'gun/sea'

// Initialize Gun with your peer configuration
const gun = Gun(['https://gun-messaging-peer.herokuapp.com/gun'])

// Create user instance for authentication
const user = gun.user()

// Export SEA for encryption utilities
const SEA = Gun.SEA

// Helper functions for common operations
const gunHelpers = {
  // Get data from a specific path
  async get(path) {
    return new Promise((resolve) => {
      gun.get(path).once((data) => {
        resolve(data)
      })
    })
  },

  // Set data at a specific path
  set(path, data) {
    gun.get(path).put(data)
  },

  // Authentication helpers
  auth: {
    async create(username, password) {
      return new Promise((resolve, reject) => {
        user.create(username, password, (ack) => {
          if (ack.err) {
            reject(new Error(ack.err))
          } else {
            resolve(ack)
          }
        })
      })
    },

    async login(username, password) {
      return new Promise((resolve, reject) => {
        user.auth(username, password, (ack) => {
          if (ack.err) {
            reject(new Error(ack.err))
          } else {
            resolve(ack)
          }
        })
      })
    },

    logout() {
      user.leave()
    },

    getCurrentUser() {
      return user.is
    }
  },

  // Post operations
  posts: {
    create(postData) {
      const post = {
        ...postData,
        id: Gun.node.lex,
        timestamp: Gun.state(),
        author: user.is?.pub || 'anonymous'
      }
      gun.get('posts').set(post)
      return post
    },

    getAll(callback) {
      gun.get('posts').map().on(callback)
    },

    getById(id, callback) {
      gun.get('posts').get(id).on(callback)
    }
  }
}

// Export everything needed
export { gun, user, SEA, gunHelpers }
export default gun

