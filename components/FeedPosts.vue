<template>
  <div class="feed-posts">
    <CreatePost @post-created="onPostCreated" />
    <h2>Latest Posts</h2>
    <div v-if="loading && posts.length === 0" class="loading">
      Loading posts...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="loadPosts" class="retry-btn">Try Again</button>
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
      v-if="hasMore && !error" 
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
import EmojiConvertor from 'emoji-js';

const supabase = useSupabaseClient();

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

    if (supabaseError) {
      throw supabaseError;
    }
    
    if (page.value === 1) {
      posts.value = data || [];
    } else {
      posts.value.push(...(data || []));
    }
    
    hasMore.value = data && data.length === postsPerPage;
    
  } catch (err) {
    error.value = err.message || 'Failed to load posts';
    console.error('Load posts error:', err);
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  if (!hasMore.value || loading.value) return;*_
