<template>
  <div class="feed-posts">
    <CreatePost @post-created="onPostCreated" />
    <h2>Latest Posts</h2>
    <div v-if="loading && posts.length === 0" class="loading">
      Loading posts...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <ul v-else class="posts-list">
      <li v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-header">
          <span class="post-author">{{ post.author || 'Anonymous' }}</span>
          <span class="post-date">{{ formatDate(post.created_at) }}</span>
        </div>
        <div v-html="renderPost(post.content)" class="post-content" />
      </li>
    </ul>
    <button 
      v-if="hasMore" 
      @click="loadMore" 
      :disabled="loading"
      class="load-more-btn"
    >
      {{ loading ? 'Loading...' : 'Load More' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CreatePost from '~/components/CreatePost.vue';
import MarkdownIt from 'markdown-it';
import emojione from 'emojione';
import { supabase } from '~/utils/supabase';

const md = new MarkdownIt();
const posts = ref([]);
const page = ref(1);
const loading = ref(false);
const error = ref('');
const hasMore = ref(true);
const postsPerPage = 10;

function renderPost(content) {
  if (!content) return '';
  const markdown = md.render(content);
  return emojione.shortnameToImage(markdown);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

async function fetchPosts(pageNum = 1, append = false) {
  loading.value = true;
  error.value = '';
  
  try {
    const from = (pageNum - 1) * postsPerPage;
    const to = from + postsPerPage - 1;
    
    const { data, error: supabaseError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (supabaseError) {
      throw supabaseError;
    }

    if (append) {
      posts.value.push(...(data || []));
    } else {
      posts.value = data || [];
    }
    
    // Check if there are more posts
    hasMore.value = (data?.length || 0) === postsPerPage;
    
  } catch (err) {
    error.value = err.message || 'Failed to fetch posts';
    console.error('Error fetching posts:', err);
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  if (loading.value || !hasMore.value) return;
  page.value++;
  fetchPosts(page.value, true);
}

function onPostCreated(newPost) {
  // Add the new post to the beginning of the list
  posts.value.unshift(newPost);
}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.feed-posts {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

.posts-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.post-item {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.post-author {
  font-weight: 600;
  color: #2c3e50;
}

.post-date {
  font-size: 0.9rem;
  color: #6c757d;
}

.post-content {
  line-height: 1.6;
  color: #333;
}

.post-content :deep(img.emoji) {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin: 0 2px;
}

.post-content :deep(p) {
  margin-bottom: 1rem;
}

.post-content :deep(p:last-child) {
  margin-bottom: 0;
}

.load-more-btn {
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.load-more-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
