import { defineStore } from 'pinia'

export const useAdStore = defineStore('ads', {
  state: () => ({
    servedAds: [] as any[],
    adBalance: 0,
    adPricing: {} as Record<string, { cpm: number; cpc: number; cpa: number }>,
    adPages: [] as any[],
    adTypes: ['image', 'video', 'text', 'audio']
  }),

  actions: {
    async fetchServedAds() {
      const res = await fetch('/api/ads/serve')
      this.servedAds = await res.json()
    },

    async trackAd(adId: string, action: 'impression' | 'click') {
      await fetch('/api/ads/track', {
        method: 'POST',
        body: JSON.stringify({ adId, action }),
        headers: { 'Content-Type': 'application/json' }
      })
    },

    async fetchBalance() {
      const res = await fetch('/api/ads/balance')
      this.adBalance = await res.json()
    },

    async topUp(amount: number) {
      await fetch('/api/ads/topup', {
        method: 'POST',
        body: JSON.stringify({ amount }),
        headers: { 'Content-Type': 'application/json' }
      })
      this.adBalance += amount
    },

    async fetchPricing() {
      const res = await fetch('/api/ads/pricing')
      const pricingArray = await res.json()
      this.adPricing = Object.fromEntries(
        pricingArray.map((p: any) => [p.type, { cpm: p.cpm, cpc: p.cpc, cpa: p.cpa }])
      )
    },

    async fetchPageRules() {
      const res = await fetch('/api/ads/pages')
      this.adPages = await res.json()
    },

    isAdAllowedOnPage(pageName: string, adType: string) {
      const page = this.adPages.find(p => p.name === pageName)
      return page?.allowed?.[adType] ?? false
    }
  }
})
