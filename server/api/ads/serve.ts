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
  const externalSources = await db.collection('externalAdSources').find().toArray()

  const externalAds = []
  for (const source of externalSources) {
    const allowed = pageRules.find(p => p.name === page)?.allowed?.external
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

  const ads = externalAds.length > 0 ? externalAds : internalAds
  const sorted = ads.sort((a, b) => (b.bid || 0) - (a.bid || 0))
  return sorted.slice(0, 3)
})
