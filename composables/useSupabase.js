// composables/useSupabase.js
export const useSupabase = () => {
  if (process.client) {
    const { $supabase } = useNuxtApp()
    return $supabase
  }
  return null
}
