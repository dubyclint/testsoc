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
      />
      <button @click="sendMessage" :disabled="!newMessage.trim()" class="send-btn">
        🚀
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gun } from '~/gundb/client';

const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const onlineUsers = ref(0);

// Mock current user - replace with actual user data
const currentUser = {
  id: 'user_' + Math.random().toString(36).substr(2, 9),
  username: 'User' + Math.floor(Math.random() * 1000),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
};

onMounted(() => {
  // Listen for new messages
  gun.get('universe_chat').map().on((data, key) => {
    if (data && data.text && data.timestamp) {
      const messageExists = messages.value.find(m => m.id === key);
      if (!messageExists) {
        messages.value.push({
          id: key,
          ...data,
          isOwn: data.userId === currentUser.id
        });
        // Sort messages by timestamp
        messages.value.sort((a, b) => a.timestamp - b.timestamp);
        nextTick(scrollToBottom);
      }
    }
  });
  
  // Mock online users count
  onlineUsers.value = Math.floor(Math.random() * 50) + 10;
});

function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  const message = {
    text: newMessage.value,
    username: currentUser.username,
    userId: currentUser.id,
    avatar: currentUser.avatar,
    timestamp: Date.now()
  };
  
  gun.get('universe_chat').set(message);
  newMessage.value = '';
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  background: #2563eb;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.online-count {
  font-size: 0.875rem;
  opacity: 0.9;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message.own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message.own .message-content {
  text-align: right;
}

.message-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.25rem;
}

.message.own .message-header {
  justify-content: flex-end;
}

.username {
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
}

.message-text {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.own .message-text {
  background: #2563eb;
  color: white;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.message-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.send-btn {
  padding: 0.75rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
