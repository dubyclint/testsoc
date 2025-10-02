<template>
  <div class="chat-box">
    <div class="chat-header">
      <h3>💬 Quick Chat</h3>
    </div>
    <div class="messages-list">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <img :src="msg.avatar" :alt="msg.sender" class="message-avatar" />
        <div class="message-content">
          <strong class="message-sender">{{ msg.sender }}:</strong> 
          <span class="message-text">{{ msg.text }}</span>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        placeholder="Type a message..." 
        class="message-input"
      />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gun } from '~/gundb/client';

const messages = ref([]);
const newMessage = ref('');
const user = 'User' + Math.floor(Math.random() * 1000); // Replace with dynamic user

onMounted(() => {
  gun.get('quick_chatroom').map().on((msg, id) => {
    if (msg && msg.text && msg.timestamp) {
      const existingMessage = messages.value.find(m => m.id === id);
      if (!existingMessage) {
        messages.value.push({ 
          id, 
          ...msg,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`
        });
        // Sort by timestamp
        messages.value.sort((a, b) => a.timestamp - b.timestamp);
      }
    }
  });
});

function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  gun.get('quick_chatroom').set({
    sender: user,
    text: newMessage.value,
    timestamp: Date.now()
  });
  
  newMessage.value = '';
}
</script>

<style scoped>
.chat-box {
  max-width: 600px;
  margin: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  background: #2563eb;
  color: white;
  padding: 1rem;
}

.chat-header h3 {
  margin: 0;
}

.messages-list {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message-sender {
  color: #2563eb;
  font-weight: 600;
}

.message-text {
  color: #374151;
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

.send-button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.send-button:hover {
  background: #1d4ed8;
}
</style>

