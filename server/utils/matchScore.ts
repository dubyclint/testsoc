export function computeMatchScore(userA, userB) {
  let score = 0

  const sharedInterests = userA.interests?.filter(i => userB.interests?.includes(i)) || []
  score += sharedInterests.length * 20

  if (userA.location === userB.location) score += 15
  if (userA.country === userB.country) score += 10
  if (userA.currency === userB.currency) score += 25
  if ((userB.usdtBalance || 0) >= 50) score += 10

  const rankMap = { Homie: 1, Trader: 2, Diplomat: 3 }
  score += (rankMap[userB.rank] || 1) * 10

  if (userB.isVerified) score += 25
  score += (userB.successfulTrades || 0) * 5

  const mutualPals = userA.pals?.filter(p => userB.pals?.includes(p)) || []
  score += mutualPals.length * 10

  if (userA.chatHistory?.includes(userB.id)) score += 10
  if (userA.pocket?.includes(userB.id)) score += 5
  if (userA.recentMatches?.includes(userB.id)) score -= 20
  if (userB.riskScore && userB.riskScore > 70) score -= 30

  return score
}
