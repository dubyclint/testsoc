<template>
  <div class="feed-page">
    <h1>Your Feed</h1>
    <FeedPosts />
  </div>
</template>

<script setup>
import FeedPosts from '~/components/posts/FeedPosts.vue';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

useHead({
  title: 'Feed - SocialVerse',
  meta: [
    { name: 'description', content: 'Your personalized social feed' }
  ]
});
</script>

<style scoped>
.feed-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.feed-page h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}
</style>




