async fetchServedAds(page = 'Home Feed') {
  const res = await fetch(`/api/ads/serve?page=${page}`)
  this.servedAds = await res.json()
}
