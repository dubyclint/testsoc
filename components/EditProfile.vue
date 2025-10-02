<template>
  <form @submit.prevent="saveProfile" class="edit-profile">
    <input v-model="profile.displayName" placeholder="Display name" />
    <input v-model="profile.avatarUrl" placeholder="Avatar URL" />
    <textarea v-model="profile.bio" placeholder="Bio" />
    <button type="submit">Save</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '#imports'
import { gun } from '~/gundb/client'

const { data: session } = useAuth()
const currentUser = session.value?.user?.id
const profile = ref({ displayName: '', avatarUrl: '', bio: '' })

onMounted(() => {
  gun.get(`users/${currentUser}`).once((data) => {
    if (data) {
      profile.value.displayName = data.displayName || ''
      profile.value.avatarUrl = data.avatarUrl || ''
      profile.value.bio = data.bio || ''
    }
  })
})

function saveProfile() {
  gun.get(`users/${currentUser}`).put(profile.value)
}
</script>

<style scoped>
.edit-profile { display: grid; gap: 0.5rem; max-width: 420px; }
</style>
