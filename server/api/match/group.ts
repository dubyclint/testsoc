import { computeMatchScore } from '~/server/utils/matchScore'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const { size = 4, region, category } = getQuery(event)

  // Step 1: Fetch candidates excluding self
  const allUsers = await db.collection('users').find({
    _id: { $ne: user.id },
    ...(region && { location: region }),
    ...(category && { tradeInterests: category })
  }).toArray()

  // Step 2: Score candidates against current user
  const scored = allUsers.map(u => ({
    ...u,
    matchScore: computeMatchScore(user, u)
  })).filter(u => u.matchScore > 30)

  // Step 3: Sort and select top candidates
  const topCandidates = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 30)

  // Step 4: Form groups of [size] with mutual compatibility
  const groups = []
  while (topCandidates.length >= size - 1) {
    const seed = topCandidates.shift()
    const compatible = topCandidates.filter(u =>
      computeMatchScore(seed, u) > 25 &&
      !user.pals?.includes(u.id) &&
      !seed.pals?.includes(u.id)
    ).slice(0, size - 1)

    if (compatible.length >= size - 1) {
      groups.push([seed, ...compatible])
      topCandidates = topCandidates.filter(u => !compatible.includes(u))
    }
  }

  // Step 5: Format response
  return groups.map(group => ({
    members: group.map(u => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      rank: u.rank,
      isVerified: u.isVerified,
      matchScore: u.matchScore
    })),
    groupScore: group.reduce((acc, u) => acc + u.matchScore, 0),
    filtersApplied: {
      size: Number(size),
      region: region || 'Any',
      category: category || 'Any'
    }
  }))
})
