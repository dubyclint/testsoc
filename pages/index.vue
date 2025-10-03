<script setup>
const { data: posts } = await useFetch('/api/posts');
</script>

<template>
  <div>
    <h1>Posts</h1>
    <ul v-if="posts && posts.length">
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
    <p v-else>No posts available</p>
  </div>
</template>
