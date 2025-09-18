const mongoose = require('mongoose')

const universeMessageSchema = new mongoose.Schema({
  senderId: String,
  country: String,
  interestTags: [String],
  message: String,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('UniverseMessage', universeMessageSchema)
