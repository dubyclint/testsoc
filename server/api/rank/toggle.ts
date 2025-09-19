export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event)
  const user = await db.collection('users').findOne({ id: userId })

  if (!user?.canToggleRank || Date.now() > new Date(user.rankToggleExpires).getTime()) {
    throw createError({ statusCode: 403, statusMessage: 'Toggle expired or not allowed' })
  }

  const newStatus = !user.hideRank
  await db.collection('users').updateOne({ id: userId }, { $set: { hideRank: newStatus } })

  return { hideRank: newStatus }
})
