export default defineEventHandler(async (event) => {
  const { adId, action } = await readBody(event)
  const userId = event.context.user.id

  await db.collection('adMetrics').insertOne({
    adId,
    userId,
    action,
    timestamp: Date.now()
  })

  return { success: true }
})
