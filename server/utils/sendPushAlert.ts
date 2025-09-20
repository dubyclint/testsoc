export async function sendPushAlert(userId, title, body) {
  const user = await db.collection('users').findOne({ _id: userId })
  if (!user?.pushToken) return

  await pushService.send({
    to: user.pushToken,
    title,
    body
  })
}
