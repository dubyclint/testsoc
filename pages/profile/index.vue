<template>
  <div class="profile-page">
    <div v-if="loading" class="loading">Loading profile...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="profile-content">
      <div class="profile-header">
        <div class="profile-info">
          <h1>{{ profile?.display_name || user?.email || 'User' }}</h1>
          <p class="profile-email">{{ user?.email }}</p>
          <p class="profile-joined">
            Joined {{ formatDate(user?.created_at) }}
          </p>
        </div>
        <button @click="editMode = !editMode" class="edit-btn">
          {{ editMode ? 'Cancel' : 'Edit Profile' }}
        </button>
      </div>
      
      <div v-if="editMode" class="edit-form">
        <h2>Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="display_name">Display Name</label>
            <input 
              id="display_name"
              v-model="editForm.display_name" 
              type="text" 
              placeholder="Your display name"
            />
          </div>
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea 
              id="bio"
              v-model="editForm.bio" 
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="updating" class="save-btn">
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
      
      <div v-else class="profile-details">
        <div v-if="profile?.bio" class="profile-bio">
          <h3>About</h3>
          <p>{{ profile.bio }}</p>
        </div>
        
        <div class="profile-stats">
          <h3>Activity</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ userPosts.length }}</span>
              <span class="stat-label">Posts</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">0</span>
              <span class="stat-label">Following</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">0</span>
              <span class="stat-label">Followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="user-posts">
        <h3>Your Posts</h3>
        <div v-if="userPosts.length === 0" class="no-posts">
          No posts yet. <NuxtLink to="/feed">Create your first post!</NuxtLink>
        </div>
        <div v-else class="posts-list">
          <div v-for="post in userPosts" :key="post.id" class="post-item">
            <div class="post-date">{{ formatDate(post.created_at) }}</div>
            <div v-html="renderPost(post.content)" class="post-content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

useHead({
  title: 'Profile - SocialVerse',
  meta: [
    { name: 'description', content: 'Your SocialVerse profile' }
  ]
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const md = new MarkdownIt();

const profile = ref(null);
const userPosts = ref([]);
const loading = ref(false);
const error = ref('');
const editMode = ref(false);
const updating = ref(false);

const editForm = ref({
  display_name: '',
  bio: ''
});

const loadProfile = async () => {
  if (!user.value) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }
    
    profile.value = data;
    editForm.value = {
      display_name: data?.display_name || '',
      bio: data?.bio || ''
    };
    
  } catch (err) {
    error.value = 'Failed to load profile';
    console.error('Profile load error:', err);
  } finally {
    loading.value = false;
  }
};

const loadUserPosts = async () => {
  if (!user.value) return;
  
  try {
    const { data, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false });
      
    if (postsError) throw postsError;
    
    userPosts.value = data || [];
  } catch (err) {
    console.error('Posts load error:', err);
  }
};

const updateProfile = async () => {
  if (!user.value) return;
  
  try {
    updating.value = true;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        display_name: editForm.value.display_name,
        bio: editForm.value.bio,
        updated_at: new Date().toISOString()
      });
      
    if (updateError) throw updateError;
    
    await loadProfile();
    editMode.value = false;
    
  } catch (err) {
    error.value = 'Failed to update profile';
    console.error('Profile update error:', err);
  } finally {
    updating.value = false;
  }
};

const renderPost = (content) => {
  if (!content) return '';
  return md.render(content);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  loadProfile();
  loadUserPosts();
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  margin: 2rem 0;
}

.loading {
  color: #6c757d;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.profile-email {
  color: #666;
  margin: 0 0 0.25rem 0;
}

.profile-joined {
  color: #888;
  font-size: 0.875rem;
  margin: 0;
}

.edit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #0056b3;
}

.edit-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.edit-form h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
}

.save-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.profile-details {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.profile-bio {
  margin-bottom: 2rem;
}

.profile-bio h3,
.profile-stats h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.user-posts {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-posts h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.no-posts {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.no-posts a {
  color: #007bff;
  text-decoration: none;
}

.no-posts a:hover {
  text-decoration: underline;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-item {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
}

.post-date {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.post-content {
  line-height: 1.6;
  color: #333;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
