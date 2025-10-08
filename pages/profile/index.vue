<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-picture-section">
          <div class="profile-picture-container">
            <img 
              v-if="profileData.avatar_url" 
              :src="profileData.avatar_url" 
              :alt="`${profileData.display_name || 'User'} profile picture`"
              class="profile-picture"
            />
            <div v-else class="profile-picture-placeholder">
              <Icon name="mdi:account" size="64" />
            </div>
            
            <div v-if="isEditing" class="profile-picture-overlay">
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                @change="handleImageSelect"
                style="display: none"
              />
              <button 
                @click="triggerFileInput" 
                class="upload-button"
                :disabled="uploading"
              >
                <Icon v-if="uploading" name="mdi:loading" class="animate-spin" />
                <Icon v-else name="mdi:camera" />
                {{ uploading ? 'Uploading...' : 'Change Photo' }}
              </button>
            </div>
          </div>
        </div>

        <div class="profile-info">
          <div v-if="!isEditing" class="view-mode">
            <h1 class="display-name">{{ profileData.display_name || 'Anonymous User' }}</h1>
            <p class="username">@{{ profileData.username || user?.email?.split('@')[0] }}</p>
            <p class="bio">{{ profileData.bio || 'No bio available' }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">{{ profileData.posts_count || 0 }}</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ profileData.followers_count || 0 }}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ profileData.following_count || 0 }}</span>
                <span class="stat-label">Following</span>
              </div>
            </div>
          </div>

          <div v-else class="edit-mode">
            <div class="form-group">
              <label for="displayName">Display Name</label>
              <input 
                id="displayName"
                v-model="editForm.display_name" 
                type="text" 
                placeholder="Enter display name"
                maxlength="50"
              />
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                id="username"
                v-model="editForm.username" 
                type="text" 
                placeholder="Enter username"
                maxlength="30"
                pattern="[a-zA-Z0-9_]+"
              />
            </div>
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea 
                id="bio"
                v-model="editForm.bio" 
                placeholder="Tell people about yourself"
                maxlength="160"
                rows="3"
              ></textarea>
              <span class="char-count">{{ editForm.bio?.length || 0 }}/160</span>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <div v-if="!isEditing" class="view-actions">
          <button @click="startEditing" class="edit-button">
            <Icon name="mdi:pencil" />
            Edit Profile
          </button>
        </div>
        <div v-else class="edit-actions">
          <button @click="cancelEditing" class="cancel-button">
            Cancel
          </button>
          <button 
            @click="saveProfile" 
            class="save-button"
            :disabled="saving"
          >
            <Icon v-if="saving" name="mdi:loading" class="animate-spin" />
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div v-if="loading" class="loading-skeleton">
          <div class="skeleton-item" v-for="n in 3" :key="n"></div>
        </div>
        <div v-else-if="userPosts.length" class="activity-grid">
          <div 
            v-for="post in userPosts" 
            :key="post.id" 
            class="activity-item"
            @click="navigateTo(`/posts/${post.id}`)"
          >
            <img v-if="post.image_url" :src="post.image_url" :alt="post.title" />
            <div class="activity-content">
              <h3>{{ post.title }}</h3>
              <p>{{ formatDate(post.created_at) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-activity">
          <Icon name="mdi:post" size="48" />
          <p>No posts yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Meta and SEO
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useHead({
  title: 'Profile - SocialVerse',
  meta: [
    { name: 'description', content: 'Manage your SocialVerse profile' }
  ]
})

// Supabase composables
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Reactive data
const profileData = reactive({
  display_name: '',
  username: '',
  bio: '',
  avatar_url: '',
  posts_count: 0,
  followers_count: 0,
  following_count: 0
})

const editForm = reactive({
  display_name: '',
  username: '',
  bio: '',
  avatar_url: ''
})

const userPosts = ref([])
const isEditing = ref(false)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref(null)

// Methods
const loadProfile = async () => {
  if (!user.value) return

  try {
    // Load user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    if (profile) {
      Object.assign(profileData, profile)
      Object.assign(editForm, profile)
    } else {
      // Create default profile
      await createDefaultProfile()
    }

    // Load user posts
    await loadUserPosts()
  } catch (error) {
    console.error('Error loading profile:', error)
    useNuxtApp().$toast.error('Failed to load profile')
  } finally {
    loading.value = false
  }
}

const createDefaultProfile = async () => {
  if (!user.value) return

  const defaultProfile = {
    user_id: user.value.id,
    display_name: user.value.user_metadata?.full_name || '',
    username: user.value.email?.split('@')[0] || '',
    bio: '',
    avatar_url: '',
    posts_count: 0,
    followers_count: 0,
    following_count: 0
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert(defaultProfile)
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return
  }

  Object.assign(profileData, data)
  Object.assign(editForm, data)
}

const loadUserPosts = async () => {
  if (!user.value) return

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, image_url, created_at')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error loading posts:', error)
    return
  }

  userPosts.value = data || []
}

const startEditing = () => {
  isEditing.value = true
  Object.assign(editForm, profileData)
}

const cancelEditing = () => {
  isEditing.value = false
  Object.assign(editForm, profileData)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    useNuxtApp().$toast.error('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    useNuxtApp().$toast.error('Image must be less than 5MB')
    return
  }

  await uploadProfilePicture(file)
}

const uploadProfilePicture = async (file) => {
  if (!user.value) return

  uploading.value = true

  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.value.id}-${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName)

    const avatarUrl = urlData.publicUrl

    // Update profile with new avatar URL
    editForm.avatar_url = avatarUrl

    // If we're not in editing mode, save immediately
    if (!isEditing.value) {
      await updateProfile({ avatar_url: avatarUrl })
    }

    useNuxtApp().$toast.success('Profile picture updated!')
  } catch (error) {
    console.error('Error uploading image:', error)
    useNuxtApp().$toast.error('Failed to upload image')
  } finally {
    uploading.value = false
  }
}

const saveProfile = async () => {
  if (!user.value) return

  saving.value = true

  try {
    await updateProfile(editForm)
    isEditing.value = false
    useNuxtApp().$toast.success('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    useNuxtApp().$toast.error('Failed to save profile')
  } finally {
    saving.value = false
  }
}

const updateProfile = async (updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.value.id)
    .select()
    .single()

  if (error) throw error

  Object.assign(profileData, data)
  return data
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  await loadProfile()
})

// Watch for user changes
watch(user, async (newUser) => {
  if (newUser) {
    await loadProfile()
  }
}, { immediate: true })
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.profile-picture-section {
  flex-shrink: 0;
}

.profile-picture-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-picture {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
}

.profile-picture-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f8fafc;
  border: 4px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.profile-picture-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 50% 50%;
  padding: 0.5rem;
}

.upload-button {
  width: 100%;
  background: transparent;
  color: white;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.profile-info {
  flex: 1;
}

.display-name {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.username {
  color: #64748b;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.bio {
  color: #475569;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.char-count {
  font-size: 0.75rem;
  color: #64748b;
  text-align: right;
  display: block;
  margin-top: 0.25rem;
}

.profile-actions {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.view-actions,
.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.edit-button,
.save-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.edit-button:hover,
.save-button:hover {
  background: #1d4ed8;
}

.cancel-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-button:hover {
  background: #4b5563;
}

.recent-activity {
  padding: 2rem;
}

.recent-activity h2 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  height: 80px;
  background: #f1f5f9;
  border-radius: 8px;
  animation: pulse 2s infinite;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.activity-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.activity-item:hover {
  transform: translateY(-2px);
}

.activity-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.activity-content {
  padding: 1rem;
}

.activity-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #1e293b;
}

.activity-content p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.no-activity {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.no-activity p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .edit-actions {
    flex-direction: column;
  }
  
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>

