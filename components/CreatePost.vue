<template>
  <form @submit.prevent="submitPost" class="create-post-form">
    <textarea 
      v-model="content" 
      placeholder="What's on your mind? You can use markdown and emojis! :smile:" 
      rows="4" 
      class="post-textarea"
      required
    />
    <div class="form-actions">
      <small class="help-text">Supports Markdown and :emoji: codes</small>
      <button type="submit" :disabled="loading || !content.trim()" class="submit-btn">
        {{ loading ? 'Posting...' : 'Post' }}
      </button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '~/utils/supabase';

const content = ref('');
const loading = ref(false);
const error = ref('');

const emit = defineEmits(['postCreated']);

const submitPost = async () => {
  if (!content.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error: supabaseError } = await supabase
      .from('posts')
      .insert([
        { 
          content: content.value.trim(),
          author: user?.email || 'Anonymous',
          user_id: user?.id || null,
          created_at: new Date().toISOString() 
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      throw supabaseError;
    }
    
    content.value = '';
    emit('postCreated', data);
    
  } catch (err) {
    error.value = err.message || 'Failed to create post';
    console.error('Post creation error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-post-form {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-textarea {
  width: 100%;
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.post-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.help-text {
  color: #6c757d;
  font-size: 0.85rem;
}

.submit-btn {
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
  padding: 0.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>


