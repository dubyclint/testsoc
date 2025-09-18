const SwapTransaction = require('../models/SwapTransaction')

exports.swapCrypto = async (req, res) => {
  const { userId, fromCurrency, toCurrency, amount } = req.body
  const feeRate = amount <= 100 ? 0.005 : 0.003
  const fee = amount * feeRate

  const swap = new SwapTransaction({ userId, fromCurrency, toCurrency, amount, fee })
  await swap.save()
  res.status(201).json({ message: 'Swap successful', fee })
}
