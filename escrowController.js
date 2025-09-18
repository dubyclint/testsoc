const Escrow = require('../models/Escrow')

exports.createEscrow = async (req, res) => {
  const { tradeId, amount } = req.body
  const fee = amount * 0.05
  const escrow = new Escrow({ tradeId, amount, fee, isReleased: false })
  await escrow.save()
  res.status(201).json(escrow)
}
