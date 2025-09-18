// server/controllers/walletController.js
const Wallet = require('../models/Wallet')

exports.createWallets = async (req, res) => {
  const { userId } = req.body

  const wallets = {
    usdt: `usdt_${userId}`,
    usdc: `usdc_${userId}`,
    btc: `btc_${userId}`,
    eth: `eth_${userId}`,
    sol: `sol_${userId}`,
    matic: `matic_${userId}`,
    xaut: `xaut_${userId}`
  }

  const newWallet = new Wallet({ userId, wallets })
  await newWallet.save()

  res.status(201).json({ wallets })
}
