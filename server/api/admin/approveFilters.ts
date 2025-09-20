export default defineEventHandler(async (event) => {
  const { userId, approvedFilters } = await readBody(event)

  await db.collection('filterRequests').updateOne(
    { userId },
    {
      $set: {
        status: 'approved',
        approvedFilters,
        rejectedFilters: []
      }
    }
  )

  return { success: true }
})
