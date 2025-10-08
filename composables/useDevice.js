import { ref, onMounted, onUnmounted } from 'vue'

export const useDevice = () => {
  const isMobile = ref(false)
  
  const checkDevice = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
  })
  
  return {
    isMobile
  }
}

// Export for global use
export const isMobile = ref(false)
