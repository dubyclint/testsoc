export async function sendNotification(userId, type, message) {
  await db.collection('notifications').insertOne({
    userId,
    type, // 'filter' | 'rematch' | 'group'
    message,
    timestamp: new Date(),
    read: false
  })
}
