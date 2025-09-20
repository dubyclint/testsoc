import { sendNotification } from '~/server/utils/sendNotification'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const filters = await readBody(event)

  const existing = await db.collection('filterRequests').findOne({ userId: user.id })

  if (existing?.status === 'pending') {
    return { success: false, message: 'You already have a pending request.' }
  }

  await db.collection('filterRequests').updateOne(
    { userId: user.id },
    {
      $set: {
        userId: user.id,
        filters,
        status: 'pending',
        approvedFilters: [],
        rejectedFilters: [],
        rejectionReason: '',
        submittedAt: new Date()
      }
    },
    { upsert: true }
  )

  await sendNotification('admin', 'filter', `${user.username} submitted a new match filter request.`)

  return { success: true, status: 'pending' }
})
