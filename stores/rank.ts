import { defineStore } from 'pinia'

export const useRankStore = defineStore('rank', {
  state: () => ({
    cache: {} as Record<string, any>
  }),

  actions: {
    async fetchRank(userId: string) {
      if (this.cache[userId]) return this.cache[userId]
      const res = await fetch(`/api/rank/get?userId=${userId}`)
      const data = await res.json()
      this.cache[userId] = data
      return data
    },

    getProgress(userId: string) {
      const data = this.cache[userId] || {}
      return {
        rank: data.rank || 'Homie',
        next: data.next || null,
        points: data.points || 0,
        hidden: data.hidden || false
      }
    }
  }
})
