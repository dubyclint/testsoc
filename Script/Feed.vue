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
