const mongoose = require('mongoose')

const giftSchema = new mongoose.Schema({
  senderId: String,
  recipientId: String,
  postId: String,
  commentId: String,
  amount: Number,
  fee: Number,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Gift', giftSchema)
