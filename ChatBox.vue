<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>💬 Real-time Chat</h3>
      <div class="connection-status">
        <span :class="['status-indicator', { 'connected': chatStore.isConnected }]"></span>
        {{ chatStore.isConnected ? 'Connected' : 'Connecting...' }}
      </div>
    </div>

    <!-- Online Users -->
    <div class="online-users" v-if="chatStore.onlineUsers.length > 0">
      <div class="users-list">
        <div v-for="user in chatStore.onlineUsers" :key="user.id" class="user-item">
          <img :src="user.avatar" :alt="user.username" class="user-avatar" />
          <span class="username">{{ user.username }}</span>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="messages-container" ref="messagesContainer">
      <div v-for="message in chatStore.sortedMessages" :key="message.id" class="message-item">
        <img :src="message.avatar" :alt="message.username" class="message-avatar" />
        <div class="message-content">
          <div class="message-header">
            <strong class="sender-name">{{ message.username }}</strong>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <p class="message-text">{{ message.message }}</p>
        </div>
      </div>

      <!-- Typing Indicators -->
      <div v-if="chatStore.currentTypingUsers.length > 0" class="typing-indicator">
        <div class="typing-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">
          {{ chatStore.currentTypingUsers.map(u => u.username).join(', ') }} 
          {{ chatStore.currentTypingUsers.length === 1 ? 'is' : 'are' }} typing...
        </span>
      </div>
    </div>

    <!-- Message Input -->
    <div class="message-input-container">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        @input="handleTyping"
        @blur="stopTyping"
        placeholder="Type your message..."
        class="message-input"
        :disabled="!chatStore.isConnected"
      />
      <button 
        @click="sendMessage" 
        class="send-button"
        :disabled="!chatStore.isConnected || !newMessage.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatStore } from '~/stores/chat'
import { useSocket } from '~/composables/useSocket'

const chatStore = useChatStore()
const { connect, disconnect, sendMessage: socketSendMessage, sendTyping } = useSocket()

const newMessage = ref('')
const messagesContainer = ref()
const typingTimeout = ref()

// Generate a user for demo (integrate with your existing auth system)
const currentUser = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  username: 'User' + Math.floor(Math.random() * 1000),
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
}

onMounted(() => {
  chatStore.setCurrentUser(currentUser)
  connect(currentUser)
})

onUnmounted(() => {
  disconnect()
})

// Auto-scroll to bottom when new messages arrive
watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

const sendMessage = () => {
  if (newMessage.value.trim() && chatStore.isConnected) {
    socketSendMessage(newMessage.value)
    newMessage.value = ''
    stopTyping()
  }
}

const handleTyping = () => {
  sendTyping(true)
  
  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  // Set new timeout to stop typing indicator
  typingTimeout.value = setTimeout(() => {
    stopTyping()
  }, 1000)
}

const stopTyping = () => {
  sendTyping(false)
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  height: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  transition: background-color 0.3s;
}

.status-indicator.connected {
  background: #10b981;
}

.online-users {
  background: #f8fafc;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.users-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.username {
  color: #374151;
  font-weight: 500;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fafafa;
}

.message-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content {
  flex: 1;
  min-width: 0;
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.sender-name {
  color: #2563eb;
  font-size: 0.9rem;
  font-weight: 600;
}

.message-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.message-text {
  color: #374151;
  margin: 0;
  word-wrap: break-word;
  line-height: 1.4;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-style: italic;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.typing-animation {
  display: flex;
  gap: 2px;
}

.typing-animation span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-animation span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-animation span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.message-input-container {
  display: flex;
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-container {
    height: 500px;
    margin: 0;
    border-radius: 0;
  }
  
  .chat-header {
    padding: 0.75rem;
  }
  
  .chat-header h3 {
    font-size: 1.1rem;
  }
  
  .connection-status {
    font-size: 0.8rem;
  }
  
  .messages-container {
    padding: 0.75rem;
  }
  
  .message-input-container {
    padding: 0.75rem;
  }
  
  .send-button {
    padding: 0.75rem 1rem;
  }
}
</style>
