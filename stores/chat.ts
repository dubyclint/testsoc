// stores/chat.ts
import { defineStore } from 'pinia'
import type { ChatMessage, User, TypingUser } from '~/types/chat'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    users: [] as User[],
    typingUsers: [] as TypingUser[],
    currentUser: null as User | null,
    isConnected: false,
    currentRoom: 'general'
  }),

  getters: {
    sortedMessages: (state) => {
      return state.messages.sort((a, b) => a.timestamp - b.timestamp)
    },
    
    onlineUsers: (state) => {
      return state.users.filter(user => user.isOnline)
    },

    currentTypingUsers: (state) => {
      return state.typingUsers.filter(user => user.isTyping && user.userId !== state.currentUser?.id)
    }
  },

  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
    },

    addMessage(message: ChatMessage) {
      // Avoid duplicates
      if (!this.messages.find(m => m.id === message.id)) {
        this.messages.push(message)
        
        // Keep only last 500 messages in memory
        if (this.messages.length > 500) {
          this.messages.splice(0, this.messages.length - 500)
        }
      }
    },

    setMessages(messages: ChatMessage[]) {
      this.messages = messages
    },

    updateUsers(users: User[]) {
      this.users = users.map(user => ({ ...user, isOnline: true }))
    },

    updateTyping(typingData: TypingUser) {
      const existingIndex = this.typingUsers.findIndex(u => u.userId === typingData.userId)
      
      if (typingData.isTyping) {
        if (existingIndex === -1) {
          this.typingUsers.push(typingData)
        } else {
          this.typingUsers[existingIndex] = typingData
        }
      } else {
        if (existingIndex !== -1) {
          this.typingUsers.splice(existingIndex, 1)
        }
      }
    },

    setConnectionStatus(status: boolean) {
      this.isConnected = status
    },

    clearMessages() {
      this.messages = []
    }
  }
})
