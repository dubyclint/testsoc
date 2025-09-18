const mongoose = require('mongoose')

const pewSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  mediaUrl: String,
  tags: [String],
  rankScore: Number,
  likes: [String],
  comments: [{
    userId: String,
    text: String,
    timestamp: Date
  }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Pew', pewSchema)
