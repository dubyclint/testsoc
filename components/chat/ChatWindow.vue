<template>
  <div class="chat-window">
    <div class="chat-header">
      <h3>💬 Universe Chat</h3>
      <div class="online-count">{{ onlineUsers }} online</div>
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', { own: message.isOwn }]"
      >
        <div class="message-avatar">
          <img :src="message.avatar" :alt="message.username" />
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="username">{{ message.username }}</span>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
        class="message-input"
        maxlength="500"
        :disabled="!gunReady"
      />
      <button 
        @click="sendMessage" 
        :disabled="!newMessage.trim() || !gunReady" 
        class="send-btn"
      >
        🚀
      </button>
    </div>
    
    <div v-if="!gunReady" class="loading-indicator">
      Connecting to chat...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// Use dynamic import for Gun.js to avoid SSR issues
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const onlineUsers = ref(0)
const gunReady = ref(false)
let gun = null

// Mock current user - replace with actual user data
const currentUser = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  username: 'User' + Math.floor(Math.random() * 1000),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
}

onMounted(async () => {
  // Only load Gun on client side
  if (process.client) {
    try {
      const gunModule = await import('~/gundb/client.js')
      gun = gunModule.gun
      gunReady.value = true
      
      // Listen for new messages
      gun.get('universe_chat').map().on((data, key) => {
        if (data && data.text && data.timestamp) {
          const messageExists = messages.value.find(m => m.id === key)
          if (!messageExists) {
            messages.value.push({
              id: key,
              ...data,
              isOwn: data.userId === currentUser.id
            })
            // Sort messages by timestamp
            messages.value.sort((a, b) => a.timestamp - b.timestamp)
            scrollToBottom()
          }
        }
      })

      // Mock online users count
      onlineUsers.value = Math.floor(Math.random() * 50) + 10
    } catch (error) {
      console.error('Failed to load Gun.js:', error)
      gunReady.value = false
    }
  }
})

const sendMessage = () => {
  if (!newMessage.value.trim() || !gun || !gunReady.value) return

  const messageData = {
    text: newMessage.value.trim(),
    username: currentUser.username,
    userId: currentUser.id,
    avatar: currentUser.avatar,
    timestamp: Date.now()
  }

  // Send message to Gun
  gun.get('universe_chat').set(messageData)
  
  newMessage.value = ''
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e1e5e9;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.online-count {
  font-size: 14px;
  opacity: 0.9;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.own {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message.own .message-content {
  text-align: right;
}

.message-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.message.own .message-header {
  justify-content: flex-end;
}

.username {
  font-weight: 600;
  font-size: 14px;
  color: #667eea;
}

.timestamp {
  font-size: 12px;
  color: #9ca3af;
}

.message-text {
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.own .message-text {
  background: #667eea;
  color: white;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e1e5e9;
  background: #f8fafc;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 48px;
}

.send-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-indicator {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
