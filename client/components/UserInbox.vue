<template>
  <div class="user-inbox">
    <div class="tabs">
      <button @click="activeTab = 'received'" :class="{ active: activeTab === 'received' }">Received</button>
      <button @click="activeTab = 'sent'" :class="{ active: activeTab === 'sent' }">Sent</button>
    </div>

    <div v-if="activeTab === 'received'" class="messages">
      <h3>Received Messages</h3>
      <ul>
        <li v-for="msg in received" :key="msg.id">
          <strong>{{ msg.from }}:</strong> {{ msg.text }}
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'sent'" class="messages">
      <h3>Sent Messages</h3>
      <ul>
        <li v-for="msg in sent" :key="msg.id">
          <strong>To {{ msg.to }}:</strong> {{ msg.text }}
        </li>
      </ul>
    </div>

    <form @submit.prevent="sendMessage" class="send-form">
      <input v-model="recipient" placeholder="Recipient username" required />
      <textarea v-model="message" placeholder="Type your message..." required></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { gun } from '~/gundb/client'
import { ref, onMounted } from 'vue'

const activeTab = ref('received')
const received = ref([])
const sent = ref([])
const recipient = ref('')
const message = ref('')
const currentUser = 'paul' // Replace with dynamic user ID later

function sendMessage() {
  const msg = {
    from: currentUser,
    to: recipient.value,
    text: message.value,
    timestamp: Date.now()
  }

  // Send to recipient's inbox
  gun.get(`inbox/${recipient.value}`).set(msg)

  // Store in sender's sent box
  gun.get(`sent/${currentUser}`).set(msg)

  sent.value.unshift(msg)
  message.value = ''
  recipient.value = ''
}

onMounted(() => {
  // Listen for received messages
  gun.get(`inbox/${currentUser}`).map().on((data, key) => {
    if (!received.value.find(m => m.timestamp === data.timestamp)) {
      received.value.unshift({ id: key, ...data })
    }
  })

  // Load sent messages
  gun.get(`sent/${currentUser}`).map().on((data, key) => {
    if (!sent.value.find(m => m.timestamp === data.timestamp)) {
      sent.value.unshift({ id: key, ...data })
    }
  })
})
</script>

<style scoped>
.user-inbox {
  padding: 1rem;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: #eee;
  cursor: pointer;
}
.tabs button.active {
  background: #ccc;
}
.messages ul {
  list-style: none;
  padding: 0;
}
.send-form {
  margin-top: 1rem;
}
.send-form input,
.send-form textarea {
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
</style>
