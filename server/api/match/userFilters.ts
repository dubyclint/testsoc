export default defineEventHandler(async (event) => {
  const user = event.context.user
  const filters = await readBody(event)

  await db.collection('filterRequests').updateOne(
    { userId: user.id },
    {
      $set: {
        userId: user.id,
        filters,
        status: 'pending',
        approvedFilters: [],
        rejectedFilters: [],
        rejectionReason: ''
      }
    },
    { upsert: true }
  )

  return { success: true, status: 'pending' }
})
