<template>
  <form @submit.prevent="submitPost">
    <textarea v-model="content" placeholder="What's on your mind?" rows="4" />
    <button type="submit">Post</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '~/utils/supabase';

const content = ref('');

const submitPost = async () => {
  if (!content.value.trim()) return;

  const { error } = await supabase.from('posts').insert([
    { content: content.value, created_at: new Date().toISOString() }
  ]);

  if (!error) {
    content.value = '';
  } else {
    console.error('Post failed:', error.message);
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
textarea {
  resize: vertical;
  padding: 0.5rem;
}
button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
}
</style>
