const mongoose = require('mongoose')

const matchRequestSchema = new mongoose.Schema({
  userId: String,
  gender: String,
  ageRange: String,
  reason: String,
  isPremium: Boolean,
  matchedUserId: String,
  approvedByAdmin: Boolean
})

module.exports = mongoose.model('MatchRequest', matchRequestSchema)
