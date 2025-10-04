<template>
  <ClientOnly>
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
        />
        <button 
          @click="sendMessage" 
          :disabled="!newMessage.trim()" 
          class="send-btn"
        >
          🚀
        </button>
      </div>
      
      <div v-if="gunStatus === 'connecting'" class="status-indicator connecting">
        Connecting to chat network...
      </div>
      <div v-else-if="gunStatus === 'connected'" class="status-indicator connected">
        Connected to Universe Chat
      </div>
      <div v-else-if="gunStatus === 'offline'" class="status-indicator offline">
        Running in offline mode
      </div>
    </div>
    
    <template #fallback>
      <div class="loading-chat">
        <div class="loading-spinner"></div>
        <span>Loading Universe Chat...</span>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// Reactive state
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const onlineUsers = ref(Math.floor(Math.random() * 50) + 10)
const gunStatus = ref('connecting')

// Mock current user
const currentUser = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  username: 'User' + Math.floor(Math.random() * 1000),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
}

// Gun instance (will be loaded dynamically)
let gun = null

onMounted(async () => {
  try {
    // Load Gun.js dynamically only on client
    const Gun = await import('gun').then(m => m.default || m)
    gun = Gun(['https://gun-manhattan.herokuapp.com/gun'])
    
    console.log('Gun.js loaded successfully')
    gunStatus.value = 'connected'
    
    // Listen for new messages from Gun
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
    
    // Initialize with welcome message
    setTimeout(() => {
      addSystemMessage("Welcome to Universe Chat! 🚀 Connect with people worldwide!")
    }, 1000)
    
  } catch (error) {
    console.warn('Gun.js not available, running in offline mode:', error)
    gunStatus.value = 'offline'
    
    // Fallback to offline mode with mock messages
    setTimeout(() => {
      addSystemMessage("Welcome to Universe Chat!")
      addSystemMessage("Currently running in offline mode. Your messages will be visible to you only.")
    }, 1000)
  }
})

const addSystemMessage = (text) => {
  const message = {
    id: Date.now() + Math.random(),
    text,
    username: 'System',
    userId: 'system',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
    timestamp: Date.now(),
    isOwn: false
  }
  
  messages.value.push(message)
  scrollToBottom()
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const messageData = {
    id: Date.now() + Math.random(),
    text: newMessage.value.trim(),
    username: currentUser.username,
    userId: currentUser.id,
    avatar: currentUser.avatar,
    timestamp: Date.now(),
    isOwn: true
  }

  // Add message to local state immediately
  messages.value.push(messageData)
  
  if (gun && gunStatus.value === 'connected') {
    // Send to Gun.js network if available
    try {
      gun.get('universe_chat').set(messageData)
    } catch (error) {
      console.warn('Failed to send message to Gun network:', error)
    }
  }
  
  newMessage.value = ''
  scrollToBottom()
  
  // Mock response in offline mode
  if (gunStatus.value === 'offline') {
    setTimeout(() => {
      if (Math.random() > 0.6) {
        const responses = [
          "Thanks for your message! 👍",
          "That's interesting! 🤔",
          "Nice to meet you! 😊",
          "How's your day going? ✨",
          "Welcome to the chat! 🎉"
        ]
        addSystemMessage(responses[Math.floor(Math.random() * responses.length)])
      }
    }, 1000 + Math.random() * 2000)
  }
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

.loading-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: #f8fafc;
  color: #667eea;
  font-weight: 500;
  gap: 16px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e1e5e9;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  border: 2px solid #f1f5f9;
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  transition: all 0.2s;
  background: white;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.send-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.status-indicator {
  position: absolute;
  top: 70px;
  right: 20px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  z-index: 10;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.status-indicator.connecting {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.status-indicator.connected {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-indicator.offline {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.2);
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
  transition: background 0.2s;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-window {
    height: 400px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .chat-input {
    padding: 12px 16px;
  }
  
  .message-input {
    padding: 10px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .send-btn {
    padding: 10px 16px;
    min-width: 44px;
  }
}
</style>
