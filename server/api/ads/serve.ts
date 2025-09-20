export default defineEventHandler(async (event) => {
  const user = event.context.user
  const location = user.location || 'Nigeria'
  const rank = user.rank || 'Homie'
  const interests = user.interests || []
  const page = getQuery(event).page || 'Home Feed'

  const candidates = await db.collection('ads').find({
    status: 'approved',
    location,
    targetRanks: { $in: [rank] },
    targetInterests: { $in: interests }
  }).toArray()

  const pageRules = await db.collection('adPageRules').find().toArray()
  const externalSources = await db.collection('externalAdSources').find().toArray()

  for (const source of externalSources) {
    const allowed = pageRules.find(p => p.name === page)?.allowed?.external
    if (allowed) {
      candidates.push({
        id: `external-${source.platform}`,
        type: 'external',
        html: source.config,
        status: 'approved'
      })
    }
  }

  const sorted = candidates.sort((a, b) => (b.bid || 0) - (a.bid || 0))
  return sorted.slice(0, 3)
})

