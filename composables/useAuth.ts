export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (email: string, password: string) => {
    // Implement login logic
  }
  
  const logout = async () => {
    user.value = null
  }
  
  const signup = async (email: string, password: string) => {
    // Implement signup logic
  }
  
  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    signup
  }
}
