export default defineEventHandler(async (event) => {
  const user = event.context.user
  const location = user.location || 'Nigeria'
  const rank = user.rank || 'Homie'
  const interests = user.interests || []
  const page = getQuery(event).page || 'Home Feed'

  const internalAds = await db.collection('ads').find({
    status: 'approved',
    location,
    targetRanks: { $in: [rank] },
    targetInterests: { $in: interests }
  }).toArray()

  const pageRules = await db.collection('adPageRules').find().toArray()
  const pageRule = pageRules.find(p => p.name === page)
  const externalSources = await db.collection('externalAdSources').find().toArray()

  const externalAds = []
  for (const source of externalSources) {
    const allowed = pageRule?.allowed?.external
    const valid = source.config && source.config.length > 10
    if (allowed && valid) {
      externalAds.push({
        id: `external-${source.platform}`,
        type: 'external',
        html: source.config,
        status: 'approved'
      })
    }
  }

  const allAds = [...internalAds, ...externalAds]
  const allowedAds = allAds.filter(ad => pageRule?.allowed?.[ad.type])

  if (pageRule?.autoBoostEnabled) {
    const metrics = await db.collection('adMetrics').find({ action: 'variant', page }).toArray()
    const formats = ['image', 'video', 'text', 'audio', 'external']
    const formatStats = formats.map(format => {
      const filtered = metrics.filter(m => m.variant === format)
      const clicks = filtered.filter(m => m.action === 'click').length
      const impressions = filtered.length
      const ctr = impressions ? clicks / impressions : 0
      return { format, ctr }
    })
    const topFormat = formatStats.sort((a, b) => b.ctr - a.ctr)[0]?.format
    const boostedAds = allowedAds.filter(ad => ad.type === topFormat)
    const sorted = boostedAds.sort((a, b) => (b.bid || 0) - (a.bid || 0))
    return sorted.slice(0, 1)
  }

  const sorted = allowedAds.sort((a, b) => (b.bid || 0) - (a.bid || 0))
  return sorted.slice(0, 1)
})
