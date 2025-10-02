<template>
  <form @submit.prevent="createGroup" class="create-group">
    <input v-model="name" placeholder="Group name" required />
    <button type="submit" :disabled="creating">
      {{ creating ? 'Creating...' : 'Create group' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '#imports'
import { gun, sea, ensureUserPair } from '~/gundb/client'

const { data: session } = useAuth()
const currentUser = session.value?.user?.id
const name = ref('')
const creating = ref(false)
const error = ref('')

async function createGroup() {
  if (!currentUser) {
    error.value = 'You must be logged in.'
    return
  }
  creating.value = true
  error.value = ''

  try {
    // Enforce 3-group limit
    const userRef = gun.get(`users/${currentUser}`)
    userRef.once(async (profile) => {
      const myGroups = profile?.groups || []
      if (myGroups.length >= 3) {
        error.value = 'You can only be in up to 3 groups.'
        creating.value = false
        return
      }

      const groupId = name.value.toLowerCase().replace(/\s+/g, '-')
      const ownerId = currentUser
      const ownerPair = await ensureUserPair(ownerId)

      // Generate a random shared secret for the group
      const groupSecret = await sea.random(24)

      // Encrypt group secret for owner; store encrypterPub for decryption reference
      const cipherForOwner = await sea.encrypt(groupSecret, await sea.secret(ownerPair.pub, ownerPair))
      const meta = {
        name: name.value,
        owner: ownerId,
        blocked: false,
        deleted: false
      }

      // Initialize group with members and encrypted keys map
      gun.get(`groups/${groupId}`).put(meta)
      gun.get(`groups/${groupId}/members`).set(ownerId)
      gun.get(`groups/${groupId}/encryptedKeys`).get(ownerId).put({
        cipher: cipherForOwner,
        from: ownerPair.pub
      })

      // Link group to user profile
      userRef.put({ groups: [...myGroups, groupId] })

      name.value = ''
    })
  } catch (e) {
    error.value = 'Failed to create group. Try again.'
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.create-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.error {
  color: #d00;
  margin-top: 0.5rem;
}
</style>
