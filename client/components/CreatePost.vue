<template>
  <div class="create-post">
    <textarea v-model="content" placeholder="What's on your mind?" />
    <input type="file" @change="handleFile" />
    <select v-model="type">
      <option value="text">Text</option>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>
    <button @click="submitPost">Post</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const type = ref('text')
const mediaFile = ref(null)

function handleFile(event) {
  mediaFile.value = event.target.files[0]
}

function submitPost() {
  // Upload mediaFile to storage
  // Send post data to backend
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
}
</style>
