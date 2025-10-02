<template>
  <div class="explore-grid">
    <h2>🔍 Explore</h2>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search users, posts, topics..." />
    </div>
    <div class="categories">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = category"
        :class="{ active: selectedCategory === category }"
        class="category-btn"
      >
        {{ category }}
      </button>
    </div>
    <div class="content-grid">
      <div v-for="item in filteredContent" :key="item.id" class="content-card">
        <img :src="item.image" :alt="item.title" />
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <div class="engagement">
          <span>❤️ {{ item.likes }}</span>
          <span>💬 {{ item.comments }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ref(['All', 'Popular', 'Recent', 'Trending', 'Art', 'Tech', 'Music']);

const exploreContent = ref([
  {
    id: 1,
    title: 'Amazing Sunset',
    description: 'Beautiful sunset from last weekend',
    image: 'https://via.placeholder.com/300x200',
    likes: 142,
    comments: 23,
    category: 'Popular'
  },
  {
    id: 2,
    title: 'New Tech Release',
    description: 'Latest gadget review',
    image: 'https://via.placeholder.com/300x200',
    likes: 89,
    comments: 15,
    category: 'Tech'
  }
]);

const filteredContent = computed(() => {
  let filtered = exploreContent.value;
  
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  return filtered;
});
</script>

<style scoped>
.explore-grid {
  padding: 1rem;
}
.search-bar {
  margin: 1rem 0;
}
.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}
.categories {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}
.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.category-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
.content-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.content-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.content-card h3 {
  padding: 0.5rem 1rem 0;
  margin: 0;
}
.content-card p {
  padding: 0 1rem;
  color: #6b7280;
}
.engagement {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}
</style>
