export default defineEventHandler(async (event) => {
  const user = event.context.user
  const { userId } = await readBody(event)

  await db.collection('users').updateOne(
    { _id: user.id },
    {
      $addToSet: {
        recentMatches: userId,
        acceptedMatches: userId
      }
    }
  )

  return { success: true }
})
