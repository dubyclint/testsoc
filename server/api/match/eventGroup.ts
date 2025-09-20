import { computeMatchScore } from '~/server/utils/matchScore'
import { sendNotification } from '~/server/utils/sendNotification'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const { eventId } = getQuery(event)

  const eventMeta = await db.collection('matchEvents').findOne({ id: eventId })
  if (!eventMeta) return []

  const { region, category, size = 4, verifiedOnly, title } = eventMeta

  const allUsers = await db.collection('users').find({
    _id: { $ne: user.id },
    ...(region && { location: region }),
    ...(category && { tradeInterests: category }),
    ...(verifiedOnly && { isVerified: true })
  }).toArray()

  const scored = allUsers.map(u => ({
    ...u,
    matchScore: computeMatchScore(user, u)
  })).filter(u => u.matchScore > 30)

  const topCandidates = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 30)

  const groups = []
  while (topCandidates.length >= size - 1) {
    const seed = topCandidates.shift()
    const compatible = topCandidates.filter(u =>
      computeMatchScore(seed, u) > 25 &&
      !user.pals?.includes(u.id)
    ).slice(0, size - 1)

    if (compatible.length >= size - 1) {
      groups.push([seed, ...compatible])
      topCandidates = topCandidates.filter(u => !compatible.includes(u))
    }
  }

  if (groups.length > 0) {
    await sendNotification(user.id, 'group', `You’ve been matched for ${title}.`)
  }

  return groups.map(group => ({
    eventId,
    members: group.map(u => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      rank: u.rank,
      isVerified: u.isVerified,
      matchScore: u.matchScore
    })),
    groupScore: group.reduce((acc, u) => acc + u.matchScore, 0)
  }))
})
