import { sendNotification } from '~/server/utils/sendNotification'

export default defineEventHandler(async (event) => {
  const { userId, reason } = await readBody(event)

  await db.collection('filterRequests').updateOne(
    { userId },
    {
      $set: {
        status: 'rejected',
        approvedFilters: [],
        rejectedFilters: ['all'],
        rejectionReason: reason.slice(0, 40)
      }
    }
  )

  await sendNotification(userId, 'filter', `Your match filters were rejected: '${reason.slice(0, 40)}'`)

  return { success: true }
})
