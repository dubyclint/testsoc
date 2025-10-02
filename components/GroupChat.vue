<template>
  <div class="group-chat" v-if="!userProfile.chatDisabled">
    <div class="header">
      <h2>{{ groupMeta?.name || groupId }}</h2>
      <span v-if="groupMeta?.blocked" class="badge blocked">Blocked</span>
      <span v-if="groupMeta?.deleted" class="badge deleted">Deleted</span>
    </div>

    <div class="admin-tools" v-if="isOwner && !groupMeta?.deleted">
      <form @submit.prevent="inviteMember" class="invite-form">
        <input v-model="inviteUserId" placeholder="Invite user ID" />
        <button type="submit">Invite</button>
      </form>
      <div class="members">
        <h4>Members</h4>
        <ul>
          <li v-for="m in members" :key="m">
            {{ m }}
            <button class="remove" @click="removeMember(m)" :disabled="m === ownerId">Remove</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="groupMeta?.deleted" class="notice">This group has been deleted.</div>
    <div v-else-if="groupMeta?.blocked" class="notice">This group is blocked by admin.</div>
    <div v-else>
      <ul class="messages">
        <li v-for="msg in messages" :key="msg.id">
          <img v-if="msg.avatar" :src="msg.avatar" class="avatar" />
          <div class="bubble">
            <div class="meta">
              <strong>{{ msg.from }}</strong>
              <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="content" v-html="renderContent(msg.text)"></div>
          </div>
        </li>
      </ul>

      <form @submit.prevent="sendMessage" class="send-form">
        <textarea v-model="draft" placeholder="Type a message..." />
        <button type="submit" :disabled="sending">Send</button>
      </form>
    </div>
  </div>

  <div v-else class="notice">Your chat privileges have been disabled by an admin.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '#imports'
import MarkdownIt from 'markdown-it'
import emojione from 'emojione'
import { gun, sea, ensureUserPair, getUserPub } from '~/gundb/client'

const md = new MarkdownIt({ breaks: true, linkify: true })

// Props or route-driven group ID
const props = defineProps<{ groupId: string }>()
const groupId = props.groupId

const { data: session } = useAuth()
const currentUser = session.value?.user?.id
const isAdmin = computed(() => session.value?.user?.role === 'admin')

const ownerId = ref<string | null>(null)
const groupMeta = ref<any>(null)
const userProfile = ref<any>({})
const members = ref<string[]>([])
const messages = ref<any[]>([])
const draft = ref('')
const sending = ref(false)

const inviteUserId = ref('')
const isOwner = computed(() => currentUser && ownerId.value === currentUser)

function formatTime(ts: number) {
  return new Date(ts).toLocaleString()
}

function renderContent(text: string) {
  const html = md.render(text || '')
  return emojione.shortnameToImage(html)
}

// Resolve and cache the decrypted group secret for current user
const groupSecretRef = ref<string | null>(null)

async function resolveGroupSecret() {
  if (!currentUser) return
  const myPair = await ensureUserPair(currentUser)
  return new Promise<void>((resolve) => {
    gun.get(`groups/${groupId}/encryptedKeys/${currentUser}`).once(async (ek) => {
      if (!ek?.cipher || !ek?.from) return resolve()
      const secret = await sea.secret(ek.from, myPair)
      const groupSecret = await sea.decrypt(ek.cipher, secret)
      groupSecretRef.value = groupSecret
      resolve()
    })
  })
}

async function sendMessage() {
  if (!draft.value.trim() || !groupSecretRef.value || sending.value) return
  sending.value = true
  try {
    // Encrypt the plaintext with the group shared secret
    const cipher = await sea.encrypt(draft.value, groupSecretRef.value)
    const payload = {
      from: currentUser,
      cipher,
      timestamp: Date.now()
    }
    gun.get(`groups/${groupId}/messages`).set(payload)
    draft.value = ''
  } finally {
    sending.value = false
  }
}

async function inviteMember() {
  const target = inviteUserId.value.trim()
  if (!target || !isOwner.value) return
  const targetPub = await getUserPub(target)
  if (!targetPub) return

  const myPair = await ensureUserPair(currentUser!)
  // Encrypt group secret for the invited member; include encrypter's pub so they can derive the shared secret
  const memberCipher = await sea.encrypt(groupSecretRef.value!, await sea.secret(targetPub, myPair))

  // Add member and store their encrypted key grant
  gun.get(`groups/${groupId}/members`).set(target)
  gun.get(`groups/${groupId}/encryptedKeys`).get(target).put({
    cipher: memberCipher,
    from: myPair.pub
  })

  // Link group to user's profile list (maintain 3-group limit for safety)
  gun.get(`users/${target}`).once((profile) => {
    const groups = profile?.groups || []
    if (groups.length < 3 && !groups.includes(groupId)) {
      gun.get(`users/${target}`).put({ groups: [...groups, groupId] })
    }
  })

  inviteUserId.value = ''
}

function removeMember(userId: string) {
  if (!isOwner.value || userId === ownerId.value) return
  // Revoke: clear encrypted key grant; member will no longer be able to decrypt
  gun.get(`groups/${groupId}/encryptedKeys/${userId}`).put(null)

  // Track removal
  gun.get(`groups/${groupId}/removedMembers`).get(userId).put(true)

  // Remove from user profile list
  gun.get(`users/${userId}`).once((profile) => {
    const groups = (profile?.groups || []).filter((g: string) => g !== groupId)
    gun.get(`users/${userId}`).put({ groups })
  })
}

onMounted(async () => {
  // User profile for chatDisabled and avatar rendering
  gun.get(`users/${currentUser}`).on((data) => {
    userProfile.value = data || {}
  })

  // Group meta
  gun.get(`groups/${groupId}`).on((meta) => {
    groupMeta.value = meta || {}
    ownerId.value = meta?.owner || null
  })

  // Members list (map to array)
  gun.get(`groups/${groupId}/members`).map().on((memberId) => {
    if (memberId && !members.value.includes(memberId)) {
      members.value.push(memberId)
    }
  })

  // Resolve group secret for current user before listening to messages
  await resolveGroupSecret()

  // Subscribe and decrypt messages
  gun.get(`groups/${groupId}/messages`).map().on(async (data, key) => {
    if (!data?.cipher || !groupSecretRef.value) return
    const plain = await sea.decrypt(data.cipher, groupSecretRef.value)

    // Fetch avatar for sender
    let avatarUrl = null
    await new Promise((resolve) => {
      gun.get(`users/${data.from}`).once((profile) => {
        avatarUrl = profile?.avatarUrl || null
        resolve(null)
      })
    })

    // Deduplicate by key
    if (!messages.value.find((m) => m.id === key)) {
      messages.value.push({
        id: key,
        from: data.from,
        text: plain,
        timestamp: data.timestamp,
        avatar: avatarUrl
      })
    }
  })
})
</script>

<style scoped>
.group-chat {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.badge {
  font-size: 0.8rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.badge.blocked { background: #ffc; color: #663; }
.badge.deleted { background: #fcc; color: #633; }
.invite-form {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.members ul { list-style: none; padding: 0; }
.members li { display: flex; align-items: center; gap: 0.5rem; }
.members .remove { font-size: 0.8rem; }
.messages { list-style: none; padding: 0; margin: 1rem 0; }
.messages li { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.avatar { width: 28px; height: 28px; border-radius: 50%; }
.bubble { background: #f8f8f8; border-radius: 8px; padding: 0.5rem 0.75rem; width: 100%; }
.meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-bottom: 0.25rem; }
.content :deep(img.emoji) { width: 18px; height: 18px; vertical-align: middle; }
.send-form { display: flex; gap: 0.5rem; }
.send-form textarea { flex: 1; padding: 0.5rem; }
.notice { color: #666; margin-top: 0.5rem; }
</style>
