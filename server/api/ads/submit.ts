export default defineEventHandler(async (event) => {
  const ad = await readBody(event)
  ad.status = 'pending'
  ad.createdAt = Date.now()
  ad.ownerId = event.context.user.id
  await db.collection('ads').insertOne(ad)
  return { success: true }
})
