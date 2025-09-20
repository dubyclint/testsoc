export default defineEventHandler(async (event) => {
  const user = event.context.user
  const location = user.location || 'Nigeria'
  const rank = user.rank || 'Homie'
  const interests = user.interests || []

  const candidates = await db.collection('ads').find({
    status: 'approved',
    location,
    targetRanks: { $in: [rank] },
    targetInterests: { $in: interests }
  }).toArray()

  const sorted = candidates.sort((a, b) => b.bid - a.bid)
  return sorted.slice(0, 3)
})
