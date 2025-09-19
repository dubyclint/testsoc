export default defineEventHandler(async (event) => {
  const { id, approve } = await readBody(event)
  const status = approve ? 'approved' : 'rejected'

  await db.collection('badgeRequests').updateOne({ id }, { $set: { status } })

  if (approve) {
    const req = await db.collection('badgeRequests').findOne({ id })
    await db.collection('users').updateOne({ id: req.userId }, { $set: { verified: true } })
  }

  return { success: true }
})
