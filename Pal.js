const mongoose = require('mongoose')

const palSchema = new mongoose.Schema({
  requesterId: String,
  recipientId: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Pal', palSchema)
