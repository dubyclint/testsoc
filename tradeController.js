const Trade = require('../models/Trade')

exports.createTrade = async (req, res) => {
  const { buyerId, sellerId, currency, amount } = req.body
  const trade = new Trade({ buyerId, sellerId, currency, amount, status: 'pending' })
  await trade.save()
  res.status(201).json(trade)
}
