import { computeMatchScore } from '~/server/utils/matchScore'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const memory = await db.collection('users').findOne({ _id: user.id })

  const candidateIds = [
    ...(memory.skippedMatches || []),
    ...(memory.recentMatches || [])
  ]

  const candidates = await db.collection('users').find({
    _id: { $in: candidateIds }
  }).toArray()

  const improved = candidates.map(u => ({
    ...u,
    matchScore: computeMatchScore(user, u)
  })).filter(u => u.matchScore > 40)

  return improved.map(u => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    rank: u.rank,
    isVerified: u.isVerified,
    matchScore: u.matchScore,
    reason: 'Improved compatibility'
  }))
})
