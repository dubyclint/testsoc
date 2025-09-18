const mongoose = require('mongoose')

const pewGiftSchema = new mongoose.Schema({
  senderId: String,
  recipientId: String,
  postId: String,
  commentId: String,
  amount: Number,
  split: {
    toCommenter: Number,
    toPostOwner: Number
  },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('PewGift', pewGiftSchema)
