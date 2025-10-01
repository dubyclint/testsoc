<template>
  <div class="feed-posts">
    <h2>Latest Posts</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.content }}</li>
    </ul>
    <button @click="loadMore">Load More</button>
  </div>
</template>

<script setup>
import { gun } from '~/gundb/client'
const posts = ref([])
const page = ref(1)

async function fetchPage() {
  const { data } = await useFetch(`/api/posts?page=${page.value}`)
  if (data.value) posts.value.push(...data.value)
}

function loadMore() {
  page.value++
  fetchPage()
}

onMounted(() => {
  fetchPage()
  gun.get('socialverse-feed').map().on((data, key) => {
    if (!posts.value.find(p => p.id === key)) {
      posts.value.unshift({ id: key, ...data })
    }
  })
})
</script>

<style scoped>
.feed-posts {
  padding: 1rem;
}
</style>

