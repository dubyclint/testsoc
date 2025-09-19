export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    role: '', // 'admin', 'buyer', 'seller'
  }),
  actions: {
    setUser(id: string, role: string) {
      this.userId = id
      this.role = role
    }
  }
})
