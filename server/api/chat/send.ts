export default defineEventHandler(async (event) => {
  const user = event.context.user
  const { recipientId, message } = await readBody(event)

  await db.collection('chats').insertOne({
    sender: user.id,
    recipient: recipientId,
    message,
    timestamp: Date.now()
  })

  await db.collection('users').updateOne(
    { _id: user.id },
    { $addToSet: { chattedWith: recipientId } }
  )

  return { success: true }
})
