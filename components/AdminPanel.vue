<template>
  <div v-if="isAdmin" class="admin-panel">
    <h3>Admin Controls</h3>
    <div class="row">
      <input v-model="targetGroup" placeholder="Group ID" />
      <button @click="blockGroup">Block</button>
      <button @click="unblockGroup">Unblock</button>
      <button @click="deleteGroup">Delete</button>
    </div>

    <div class="row">
      <input v-model="targetUser" placeholder="User ID" />
      <button @click="disableUserChat">Disable Chat</button>
      <button @click="enableUserChat">Enable Chat</button>
    </div>
  </div>

  <div v-else class="notice">Admin access required.</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '#imports'
import { gun } from '~/gundb/client'

const { data: session } = useAuth()
const isAdmin = computed(() => session.value?.user?.role === 'admin')

const targetGroup = ref('')
const targetUser = ref('')

function blockGroup() {
  if (!targetGroup.value) return
  gun.get(`groups/${targetGroup.value}`).put({ blocked: true })
}
function unblockGroup() {
  if (!targetGroup.value) return
  gun.get(`groups/${targetGroup.value}`).put({ blocked: false })
}
function deleteGroup() {
  if (!targetGroup.value) return
  gun.get(`groups/${targetGroup.value}`).put({ deleted: true })
}
function disableUserChat() {
  if (!targetUser.value) return
  gun.get(`users/${targetUser.value}`).put({ chatDisabled: true })
}
function enableUserChat() {
  if (!targetUser.value) return
  gun.get(`users/${targetUser.value}`).put({ chatDisabled: false })
}
</script>

<style scoped>
.admin-panel { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; }
.row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.notice { color: #666; font-size: 0.9rem; }
</style>
