export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId || event.context.user.id
  const pending = query.pending === 'true'

  if (pending) {
    return await db.collection('badgeRequests').find({ status: 'pending' }).toArray()
  }

  const req = await db.collection('badgeRequests').findOne({ userId })
  return { status: req?.status || 'none' }
})
