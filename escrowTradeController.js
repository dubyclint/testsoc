const Escrow = require('../models/Escrow')

exports.createTrade = async (req, res) => {
  const { buyerId, sellerId, amount, token, tradeId } = req.body
  const deal = new Escrow({ buyerId, sellerId, amount, token, tradeId })
  await deal.save()
  res.status(201).json({ message: 'Escrow created', deal })
}

exports.getEscrowHistory = async (req, res) => {
  const { userId } = req.query
  const deals = await Escrow.find({
    $or: [{ buyerId: userId }, { sellerId: userId }]
  }).sort({ timestamp: -1 })
  res.status(200).json(deals)
}

exports.getEscrowStatus = async (req, res) => {
  const { tradeId } = req.query
  const deal = await Escrow.findOne({ tradeId })
  res.status(200).json(deal)
}
