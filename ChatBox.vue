<template>
  <div class="chat-box">
    <div v-for="msg in messages" :key="msg.id" class="message">
      <strong>{{ msg.sender }}:</strong> {{ msg.text }}
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gun from '@/composables/useGun'

const messages = ref([])
const newMessage = ref('')
const user = 'Paul' // Replace with dynamic user

onMounted(() => {
  gun.get('chatroom').map().on((msg, id) => {
    messages.value.push({ id, ...msg })
  })
})

function sendMessage() {
  gun.get('chatroom').set({
    sender: user,
    text: newMessage.value,
    timestamp: Date.now()
  })
  newMessage.value = ''
}
</script>

<style scoped>
.chat-box {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}
.message {
  margin-bottom: 0.5rem;
}
</style>
