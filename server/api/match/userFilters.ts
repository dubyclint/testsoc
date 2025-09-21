import { sendNotification } from '~/server/utils/sendNotification'
import { sendPushAlert } from '~/server/utils/sendPushAlert'
import { evaluateTrust } from '~/server/utils/evaluateTrust'

export default defineEventHandler(async (event) => {
  const user = await db.collection('users').findOne({ _id: event.context.user.id })
  const filters = await readBody(event)

  const trust = evaluateTrust(user)

  if (trust.isTrusted) {
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { matchFilters: filters } }
    )

    await db.collection('filterRequests').deleteOne({ userId: user._id })

    await sendNotification(user._id, 'filter', 'Your filters were auto-approved.')
    await sendPushAlert(user._id, 'Filters Activated', 'Your trusted filters are now live.')

    return {
      success: true,
      status: 'approved',
      autoApproved: true,
      criteriaMet: trust.criteriaMet,
      priorityRatio: trust.priorityRatio
    }
  }

  const existing = await db.collection('filterRequests').findOne({ userId: user._id })
  if (existing?.status === 'pending') {
    return { success: false, message: 'You already have a pending request.' }
  }

  await db.collection('filterRequests').updateOne(
    { userId: user._id },
    {
      $set: {
        userId: user._id,
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
  await sendPushAlert('admin', 'New Filter Request', `${user.username} submitted filters.`)

  return { success: true, status: 'pending' }
})

