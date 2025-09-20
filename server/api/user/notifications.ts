export default defineEventHandler(async (event) => {
  const user = event.context.user
  const notes = await db.collection('notifications')
    .find({ userId: user.id })
    .sort({ timestamp: -1 })
    .toArray()

  return notes
})
