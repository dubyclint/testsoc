const mongoose = require('mongoose')

const userWalletSchema = new mongoose.Schema({
  userId: String,
  balances: {
    usdt: Number,
    usdc: Number,
    btc: Number,
    eth: Number,
    sol: Number,
    matic: Number,
    xaut: Number
  },
  extraWallets: [{
    symbol: String,
    address: String,
    balance: Number
  }]
})

module.exports = mongoose.model('UserWallet', userWalletSchema)
