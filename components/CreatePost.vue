<template>
  <form @submit.prevent="submitPost" class="create-post-form">
    <textarea 
      v-model="content" 
      placeholder="What's on your mind?" 
      rows="4" 
      class="post-textarea"
      required
    />
    <button type="submit" :disabled="loading || !content.trim()" class="submit-btn">
      {{ loading ? 'Posting...' : 'Post' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '~/utils/supabase';

const content = ref('');
const loading = ref(false);
const error = ref('');

const submitPost = async () => {
  if (!content.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const { data, error: supabaseError } = await supabase
      .from('posts')
      .insert([
        { 
          content: content.value, 
          created_at: new Date().toISOString() 
        }
      ])
      .select();

    if (supabaseError) {
      throw supabaseError;
    }
    
    content.value = '';
    // Emit success event or refresh posts
    emit('postCreated', data[0]);
  } catch (err) {
    error.value = err.message || 'Failed to create post';
    console.error('Post creation error:', err);
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(['postCreated']);
</script>

<style scoped>
.create-post-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 600px;
}

.post-textarea {
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
}

.submit-btn {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0;
}
</style>

