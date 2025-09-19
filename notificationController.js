const Notification = require('../models/Notification')

exports.getNotifications = async (req, res) => {
  const { userId } = req.query
  const notes = await Notification.find({ userId }).sort({ timestamp: -1 })
  res.status(200).json(notes)
}

exports.markRead = async (req, res) => {
  const { notificationId } = req.body
  await Notification.findByIdAndUpdate(notificationId, { isRead: true })
  res.status(200).json({ message: 'Marked as read' })
}
