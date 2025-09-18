const mongoose = require('mongoose')

const swapSchema = new mongoose.Schema({
  userId: String,
  fromCurrency: String,
  toCurrency: String,
  amount: Number,
  fee: Number,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('SwapTransaction', swapSchema)
