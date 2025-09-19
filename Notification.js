const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  message: String,
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', notificationSchema)
