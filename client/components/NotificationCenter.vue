<template>
  <div class="notification-center">
    <h3>Notifications</h3>
    <ul>
      <li v-for="note in notifications" :key="note._id">
        <span :class="{ unread: !note.isRead }">
          {{ note.message }} — {{ formatDate(note.timestamp) }}
        </span>
        <button v-if="!note.isRead" @click="markAsRead(note._id)">Mark as read</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/notification/list?userId=user123')
  notifications.value = await res.json()
})

async function markAsRead(id) {
  await fetch('http://localhost:3000/api/notification/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notificationId: id })
  })
  const note = notifications.value.find(n => n._id === id)
  if (note) note.isRead = true
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}
</script>

<style scoped>
.notification-center {
  border: 1px solid #ccc;
  padding: 1rem;
}
.unread {
  font-weight: bold;
}
</style>
