export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, socialLink } = body
  const userId = event.context.user.id

  const id = crypto.randomUUID()
  await db.collection('badgeRequests').insertOne({
    id,
    userId,
    name,
    socialLink,
    docUrl: 'uploaded-doc-url', // Replace with actual upload logic
    status: 'pending'
  })

  return { status: 'pending' }
})
