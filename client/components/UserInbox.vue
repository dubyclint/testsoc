<template>
  <div class="user-inbox">
    <h3>📨 Your Escrow Updates</h3>
    <ul>
      <li v-for="note in filteredNotifications" :key="note.id">
        <strong>{{ note.type.toUpperCase() }}</strong> — Deal #{{ note.dealId }} — {{ formatDate(note.timestamp) }}
      </li>
    </ul>
    <p v-if="filteredNotifications.length === 0">No updates yet.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user' // adjust path if needed

const notifications = ref([])
const userStore = useUserStore()
const userId = userStore.userId || 'user123' // fallback for dev

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

const filteredNotifications = computed(() =>
  notifications.value.filter(n => n.userId === userId)
)

onMounted(() => {
  const socket = io('http://localhost:3000')
  socket.on('escrow:userUpdate', ({ dealId, action, userId: eventUser }) => {
    notifications.value.unshift({
      id: Date.now(),
      dealId,
      type: action,
      userId: eventUser,
      timestamp: new Date().toISOString()
    })
  })
})
</script>

<style scoped>
.user-inbox {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 2rem;
  max-width: 600px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
