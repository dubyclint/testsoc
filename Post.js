const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  userId: String,
  content: String,
  mediaUrl: String,
  type: { type: String, enum: ['text', 'image', 'video'] },
  likes: [String],
  comments: [{
    userId: String,
    text: String,
    timestamp: Date
  }],
  createdAt: { type: Date, default: Date.now },
  isVerified: Boolean
})

module.exports = mongoose.model('Post', postSchema)
