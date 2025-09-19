export default defineEventHandler(async (event) => {
  const { userId, delta } = await readBody(event)
  const user = await db.collection('users').findOne({ id: userId })
  const newPoints = (user?.rankPoints || 0) + delta

  await db.collection('users').updateOne({ id: userId }, { $set: { rankPoints: newPoints } })
  return { success: true }
})
