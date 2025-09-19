const mongoose = require('mongoose')

const escrowTradeSchema = new mongoose.Schema({
  buyerId: String,
  sellerId: String,
  amount: Number,
  token: String,
  tradeId: String,
  isReleased: { type: Boolean, default: false },
  isRefunded: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('EscrowTrade', escrowTradeSchema)

