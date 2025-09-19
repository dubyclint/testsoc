import { defineStore } from 'pinia'

export const useVerifiedStore = defineStore('verified', {
  state: () => ({
    statusMap: {} as Record<string, 'approved' | 'pending' | 'rejected' | 'none'>
  }),

  actions: {
    async fetchStatus(userId: string) {
      if (this.statusMap[userId]) return this.statusMap[userId]

      try {
        const res = await fetch(`/api/verified/status?userId=${userId}`)
        const data = await res.json()
        this.statusMap[userId] = data.status || 'none'
        return this.statusMap[userId]
      } catch (err) {
        console.error('Failed to fetch badge status:', err)
        this.statusMap[userId] = 'none'
        return 'none'
      }
    },

    setStatus(userId: string, status: 'approved' | 'pending' | 'rejected' | 'none') {
      this.statusMap[userId] = status
    }
  }
})
