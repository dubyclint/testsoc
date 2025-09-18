// server/models/Wallet.js
const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  userId: String,
  wallets: {
    usdt: String,
    usdc: String,
    btc: String,
    eth: String,
    sol: String,
    matic: String,
    xaut: String
  }
})

module.exports = mongoose.model('Wallet', walletSchema)
