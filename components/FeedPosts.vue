<template>
  <div class="feed-posts">
    <h2>Latest Posts</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.content }}</li>
    </ul>
  </div>
</template>

<script setup>
const posts = ref([
  { id: 1, content: 'Welcome to Socialverse!' },
  { id: 2, content: 'This is your personalized feed.' }
])
</script>

<style scoped>
.feed-posts {
  padding: 1rem;
}
</style>

