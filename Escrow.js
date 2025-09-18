const mongoose = require('mongoose')

const escrowSchema = new mongoose.Schema({
  tradeId: String,
  amount: Number,
  fee: Number,
  isReleased: Boolean,
  approvedByAdmin: Boolean
})

module.exports = mongoose.model('Escrow', escrowSchema)
