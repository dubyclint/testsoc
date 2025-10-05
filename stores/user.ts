// stores/user.ts - Remove the top-level import
// DELETE: import { supabase } from '~/utils/supabase'

export const useUserStore = defineStore('user', () => {
  // Use lazy access instead
  const getSupabase = () => {
    if (process.client) {
      const { $supabase } = useNuxtApp()
      return $supabase
    }
    return null
  }
  
  const login = async (email, password) => {
    const supabase = getSupabase()
    if (!supabase) return
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    // ... rest of your logic
  }
  
  return { login, /* other methods */ }
})
