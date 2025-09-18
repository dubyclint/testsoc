const mongoose = require('mongoose')

const p2pProfileSchema = new mongoose.Schema({
  userId: String,
  acceptedCurrencies: [String],
  kycVerified: Boolean,
  isActive: Boolean,
  approvedByAdmin: Boolean
})

module.exports = mongoose.model('P2PProfile', p2pProfileSchema)
