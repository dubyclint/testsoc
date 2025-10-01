<template>
  <form @submit.prevent="submitPost" class="create-post">
    <textarea
      v-model="content"
      placeholder="What's on your mind?"
      required
    ></textarea>

    <input type="file" @change="handleFile" />
    <select v-model="type">
      <option value="text">Text</option>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Posting...' : 'Post' }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { gun } from '~/gundb/client'

const content = ref('')
const type = ref('text')
const mediaFile = ref(null)
const loading = ref(false)
const error = ref('')

function handleFile(event) {
  mediaFile.value = event.target.files[0]
}

async function submitPost() {
  if (!content.value.trim()) return

  loading.value = true
  error.value = ''

  try {
    let mediaUrl = null

    // Placeholder: Upload mediaFile to storage
    if (mediaFile.value) {
      const formData = new FormData()
      formData.append('file', mediaFile.value)
      const uploadRes = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      mediaUrl = uploadRes.url
    }

    // Save to backend
    const payload = {
      content: content.value,
      type: type.value,
      mediaUrl
    }

    await $fetch('/api/posts', {
      method: 'POST',
      body: payload
    })

    // Broadcast via GunDB
    gun.get('socialverse-feed').set({
      ...payload,
      timestamp: Date.now()
    })

    content.value = ''
    mediaFile.value = null
    type.value = 'text'
  } catch (err) {
    error.value = 'Failed to post. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-post {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 2rem;
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
input[type="file"],
select {
  display: block;
  margin-top: 0.5rem;
}
button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>

