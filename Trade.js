const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
  buyerId: String,
  sellerId: String,
  currency: String,
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'] },
  chatId: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Trade', tradeSchema)
