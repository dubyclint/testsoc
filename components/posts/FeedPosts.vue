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
        <div v-html="renderPost(post.content)" class="post-content"></div>
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
import CreatePost from '~/components/posts/CreatePost.vue';
import MarkdownIt from 'markdown-it';
import EmojiConvertor from 'emoji-js';
import { supabase } from '~/utils/supabase';

const md = new MarkdownIt();
const emoji = new EmojiConvertor();
emoji.img_set = 'emojione';
emoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/4.5/png/64/';

const posts = ref([]);
const page = ref(1);
const loading = ref(false);
const error = ref('');
const hasMore = ref(true);
const postsPerPage = 10;

function renderPost(content) {
  if (!content) return '';
  const markdown = md.render(content);
  return emoji.replace_colons(markdown);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function onPostCreated(newPost) {
  posts.value.unshift(newPost);
}

async function loadPosts() {
  try {
    loading.value = true;
    error.value = '';
    
    const { data, error: supabaseError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page.value - 1) * postsPerPage, page.value * postsPerPage - 1);
    
    if (supabaseError) throw supabaseError;
    
    if (data && data.length > 0) {
      if (page.value === 1) {
        posts.value = data;
      } else {
        posts.value.push(...data);
      }
      hasMore.value = data.length === postsPerPage;
    } else {
      hasMore.value = false;
    }
  } catch (err) {
    error.value = 'Failed to load posts: ' + err.message;
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  page.value++;
  loadPosts();
}

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.feed-posts {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #e74c3c;
  background: #fdf2f2;
  border-radius: 4px;
}

.posts-list {
  list-style: none;
  padding: 0;
}

.post-item {
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #657786;
}

.post-author {
  font-weight: bold;
  color: #1da1f2;
}

.post-content {
  line-height: 1.5;
}

.load-more-btn {
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  background: #1da1f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.load-more-btn:hover {
  background: #1991db;
}

.load-more-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

