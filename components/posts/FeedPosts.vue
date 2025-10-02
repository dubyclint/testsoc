<script setup>
import { ref, onMounted } from 'vue';
import { gun } from '~/gundb/client';
import CreatePost from '~/components/posts/CreatePost.vue';
import MarkdownIt from 'markdown-it';
import emojione from 'emojione';

const posts = ref([]);
const loading = ref(true);

const md = new MarkdownIt();

onMounted(() => {
  // Load posts from GunDB
  gun.get('posts').map().on((data, key) => {
    if (data && data.content && data.timestamp) {
      const existingPost = posts.value.find(p => p.id === key);
      if (!existingPost) {
        posts.value.push({
          id: key,
          ...data
        });
        // Sort by timestamp (newest first)
        posts.value.sort((a, b) => b.timestamp - a.timestamp);
      }
    }
  });
  
  loading.value = false;
});

function handleNewPost(post) {
  posts.value.unshift(post);
}

function formatContent(content) {
  // Convert markdown and emojis
  let formatted = md.render(content);
  formatted = emojione.toImage(formatted);
  return formatted;
}

function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
</script>

<template>
  <div class="feed-posts">
    <CreatePost @post-created="handleNewPost" />
    
    <div v-if="loading" class="loading">
      Loading posts...
    </div>
    
    <div v-else-if="posts.length === 0" class="no-posts">
      <p>No posts yet. Be the first to share something!</p>
    </div>
    
    <div v-else class="posts-list">
      <article 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
      >
        <div class="post-header">
          <div class="author-info">
            <img 
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`" 
              :alt="post.author"
              class="author-avatar"
            />
            <div>
              <h4 class="author-name">{{ post.author }}</h4>
              <time class="post-time">{{ formatTime(post.timestamp) }}</time>
            </div>
          </div>
        </div>
        
        <div class="post-content" v-html="formatContent(post.content)"></div>
        
        <div class="post-actions">
          <button class="action-btn like-btn">
            ❤️ {{ post.likes || 0 }}
          </button>
          <button class="action-btn comment-btn">
            💬 {{ post.comments || 0 }}
          </button>
          <button class="action-btn share-btn">
            🔄 Share
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.feed-posts {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .no-posts {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.post-header {
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.post-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.post-content {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #374151;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.like-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.comment-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.share-btn:hover {
  background: #f0f9ff;
  color: #0891b2;
}
</style>
