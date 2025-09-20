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

  const allAds = [...internalAds, ...externalAds]
  const filtered = allAds.filter(a => pageRules.find(p => p.name === page)?.allowed?.[a.type])
  const sorted = filtered.sort((a, b) => (b.bid || 0) - (a.bid || 0))

  // Rotation logic: pick one ad based on timestamp
  const index = Math.floor(Date.now() / 10000) % sorted.length
  return [sorted[index]]
})
