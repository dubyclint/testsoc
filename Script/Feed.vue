<script setup lang="ts">  
  definePageMeta({  
  middleware: ['auth', 'profile-completion',  'language-check' ],  
  layout: 'default'  
})  
    
import { ref, computed, onMounted, onBeforeMount, watch, onUnmounted } from 'vue'  
import { useRoute, useRouter } from 'vue-router'  
import { useAuthStore } from '~/stores/auth'  
import { useProfileStore } from '~/stores/profile'  
import { useFetchWithAuth } from '~/composables/use-fetch'  
import { useAuth } from '~/composables/use-auth'  
import EmailVerificationBanner from '~/components/EmailVerificationBanner.vue'  
// ============================================================================  
// SETUP & INITIALIZATION  
// ============================================================================  
const route = useRoute()  
const router = useRouter()  
const authStore = useAuthStore()  
const profileStore = useProfileStore()  
const fetchWithAuth = useFetchWithAuth()  
const { logout } = useAuth()  
// ============================================================================  
// REACTIVE STATE - HEADER & SIDEBAR  
// ============================================================================  
const sidebarOpen = ref(false)  
const isLiveStreaming = ref(false)  
// ============================================================================  
// REACTIVE STATE - POSTS & FEED  
// ============================================================================  
const posts = ref<any[]>([])  
const postsLoading = ref(true)  
const loadingMore = ref(false)  
const hasMorePosts = ref(true)  
const currentPage = ref(1)  
const activeTab = ref('for-you')  
const activePostMenu = ref<string | null>(null)  
// ============================================================================  
// REACTIVE STATE - USERS & RECOMMENDATIONS  
// ============================================================================  
const suggestedUsers = ref<any[]>([])  
const suggestedUsersLoading = ref(false)  
// ============================================================================  
// REACTIVE STATE - TRENDING & SEARCH  
// ============================================================================  
const trendingTopics = ref<any[]>([])  
const trendingLoading = ref(false)  
const searchQuery = ref('')  
// ============================================================================  
// REACTIVE STATE - NOTIFICATIONS & MESSAGES  
// ============================================================================  
const unreadNotifications = ref(0)  
const unreadMessages = ref(0)  
// ============================================================================  
// EVENT HANDLERS  
// ============================================================================  
const handleVerificationSent = () => {  
  console.log('[Feed] Verification email sent')  
}  
const handleBannerDismissed = () => {  
  console.log('[Feed] Verification banner dismissed')  
}  
const handleEmailVerified = () => {  
  console.log('[Feed] Email verified, banner hidden')  
}  
// ============================================================================  
// REACTIVE STATE - USER PROFILE  
// ============================================================================  
const walletBalance = ref('$0.00')  
const isVerified = ref(false)  
// ============================================================================  
// REACTIVE STATE - PROFILE DATA LAYER  
// ============================================================================  
const profileLoading = ref(true)  
const profileError = ref<string | null>(null)  
const profileComplete = ref(false)  
const profileSyncing = ref(false)  
const lastProfileSync = ref<Date | null>(null)  
// ============================================================================  
// COMPUTED PROPERTIES - USER DATA FROM AUTH STORE  
// ============================================================================  
const currentUser = computed(() => authStore.user)  
// ✅ FIX #1: Get user ID for profile navigation  
const currentUserId = computed(() => {  
  return profileStore.profile?.id ||  
         profileStore.profile?.user_id ||  
         currentUser.value?.id ||   
         null  
})  
const userName = computed(() => {  
  const name = profileStore.profile?.full_name ||  
               currentUser.value?.user_metadata?.full_name ||   
               currentUser.value?.full_name ||   
               'User'  
  console.log('[Feed] userName computed:', name)  
  return name  
})  
const userUsername = computed(() => {  
  const username = profileStore.profile?.username ||  
                   currentUser.value?.user_metadata?.username ||   
                   currentUser.value?.username ||   
                   ''  
  console.log('[Feed] userUsername computed:', {  
    value: username,  
    isEmpty: !username,  
    isValid: username && username.trim() !== '' && username !== 'username',  
    source: profileStore.profile?.username ? 'profileStore' : 'authStore'  
  })  
  return username  
})  
const userAvatar = computed(() => {  
  const avatar = profileStore.profile?.avatar_url ||  
                 currentUser.value?.user_metadata?.avatar_url ||   
                 currentUser.value?.avatar_url ||   
                 '/default-avatar.svg'  
  console.log('[Feed] userAvatar computed:', avatar)  
  return avatar  
})  
const userFollowers = computed(() => {  
  return profileStore.profile?.followers_count ||  
         currentUser.value?.user_metadata?.followers_count || 0  
})  
const userFollowing = computed(() => {  
  return profileStore.profile?.following_count ||  
         currentUser.value?.user_metadata?.following_count || 0  
})  
const userPosts = computed(() => {  
  return profileStore.profile?.posts_count ||  
         currentUser.value?.user_metadata?.posts_count || 0  
})  
const userStatus = computed(() => {  
  return profileStore.profile?.status ||  
         currentUser.value?.user_metadata?.status || 'online'  
})  
// ============================================================================  
// FEED TABS CONFIGURATION  
// ============================================================================  
const feedTabs = [  
  { id: 'for-you', label: 'For You', icon: 'home' },  
  { id: 'following', label: 'Following', icon: 'users' },  
  { id: 'trending', label: 'Trending', icon: 'trending-up' }  
]  

  // ============================================================================  
// METHODS - HEADER & SIDEBAR  
// ============================================================================  
const toggleSidebar = () => {  
  console.log('[Feed] Toggle sidebar')  
  sidebarOpen.value = !sidebarOpen.value  
}  
const handleLogout = async () => {  
  try {  
    console.log('[Feed] Logging out user')  
    sidebarOpen.value = false  
    profileStore.clearProfile()  
      
    const result = await logout()  
      
    if (result.success) {  
      console.log('[Feed] ✅ Logout successful')  
      router.push('/auth/signin')  
    } else {  
      console.error('[Feed] ✗ Logout failed:', result.error)  
    }  
  } catch (error) {  
    console.error('[Feed] Error logging out:', error)  
  }  
}  
const retryProfileLoad = async () => {  
  console.log('[Feed] Retrying profile load')  
  profileError.value = null  
  profileLoading.value = true  
  await fetchProfileData()  
}  
// ============================================================================  
// NAVIGATION METHODS - WITH COMPREHENSIVE VALIDATION  
// ============================================================================  
// ✅ FIX #2: Navigate to own profile using user ID  
const goToProfile = () => {  
  console.log('[Feed] goToProfile() called')  
  console.log('[Feed] Current user:', {  
    id: currentUser.value?.id,  
    userId: currentUserId.value,  
    username: userUsername.value,  
    email: currentUser.value?.email  
  })  
    
  if (!currentUser.value || !currentUser.value.id) {  
    console.error('[Feed] ❌ User not authenticated')  
    return  
  }  
    
  // ✅ FIX: Use user ID for navigation instead of username  
  const userId = currentUserId.value  
  if (!userId) {  
    console.error('[Feed] ❌ User ID is missing')  
    console.error('[Feed] Available data:', {  
      username: userUsername.value,  
      email: currentUser.value?.email,  
      userId: currentUserId.value  
    })  
    return  
  }  
    
  console.log('[Feed] ✅ All validations passed, navigating to profile with ID:', userId)  
  sidebarOpen.value = false  
  router.push(`/profile/${userId}`)  
}  
// ✅ FIX #3: Navigate to other user's profile using user ID  
const goToUserProfile = (username: string) => {  
  console.log('[Feed] goToUserProfile() called with username:', username)  
    
  if (!username) {  
    console.error('[Feed] ❌ Username not provided')  
    return  
  }  
    
  if (typeof username !== 'string') {  
    console.error('[Feed] ❌ Username is not a string:', typeof username)  
    return  
  }  
    
  const trimmedUsername = username.trim()  
  if (trimmedUsername === '') {  
    console.error('[Feed] ❌ Username is empty after trim')  
    return  
  }  
    
  if (trimmedUsername === 'username' || trimmedUsername === 'user' || trimmedUsername === 'User') {  
    console.error('[Feed] ❌ Username is a placeholder:', trimmedUsername)  
    return  
  }  
    
  if (!/^[a-z0-9_-]+$/.test(trimmedUsername.toLowerCase())) {  
    console.error('[Feed] ❌ Username contains invalid characters:', trimmedUsername)  
    return  
  }  
    
  console.log('[Feed] ✅ All validations passed, navigating to user profile with username:', trimmedUsername)  
  sidebarOpen.value = false  
  // ✅ FIX: Pass username to profile page, which will fetch user ID from API  
  router.push(`/profile/${trimmedUsername}`)  
}  
// ✅ FIX #4: Navigate to followers using user ID  
const goToFollowers = () => {  
  console.log('[Feed] goToFollowers() called')  
    
  const userId = currentUserId.value  
  if (!userId) {  
    console.error('[Feed] ❌ Invalid user ID, cannot navigate to followers')  
    return  
  }  
    
  console.log('[Feed] ✅ Navigating to followers for user ID:', userId)  
  router.push(`/profile/${userId}?tab=followers`)  
}  
// ✅ FIX #5: Navigate to following using user ID  
const goToFollowing = () => {  
  console.log('[Feed] goToFollowing() called')  
    
  const userId = currentUserId.value  
  if (!userId) {  
    console.error('[Feed] ❌ Invalid user ID, cannot navigate to following')  
    return  
  }  
    
  console.log('[Feed] ✅ Navigating to following for user ID:', userId)  
  router.push(`/profile/${userId}?tab=following`)  
}  
// ✅ FIX #6: Navigate to user posts using user ID  
const goToUserPosts = () => {  
  console.log('[Feed] goToUserPosts() called')  
    
  const userId = currentUserId.value  
  if (!userId) {  
    console.error('[Feed] ❌ Invalid user ID, cannot navigate to user posts')  
    return  
  }  
    
  console.log('[Feed] ✅ Navigating to user posts for user ID:', userId)  
  router.push(`/profile/${userId}?tab=posts`)  
}  
const goToCreatePost = () => {  
  console.log('[Feed] goToCreatePost() called')  
  sidebarOpen.value = false  
  router.push('/posts/create')  
}  
// ✅ FIX #7: Share profile using user ID  
const shareProfile = async () => {  
  console.log('[Feed] shareProfile() called')  
    
  const userId = currentUserId.value  
  if (!userId) {  
    console.error('[Feed] ❌ Cannot share profile - user ID is invalid')  
    return  
  }  
    
  try {  
    // ✅ FIX: Use user ID in profile URL  
    const profileUrl = `${window.location.origin}/profile/${userId}`  
      
    if (navigator.share) {  
      await navigator.share({  
        title: `Check out ${userName.value}`,  
        text: `Follow ${userName.value} on SocialVerse!`,  
        url: profileUrl  
      })  
      console.log('[Feed] ✅ Profile shared via native share')  
    } else {  
      await navigator.clipboard.writeText(profileUrl)  
      console.log('[Feed] ✅ Profile URL copied to clipboard')  
    }  
  } catch (error) {  
    console.error('[Feed] Error sharing profile:', error)  
  }  
}  
