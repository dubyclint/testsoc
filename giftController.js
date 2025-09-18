const Gift = require('../models/Gift')

exports.sendGift = async (req, res) => {
  const { senderId, recipientId, postId, commentId, amount } = req.body
  const fee = 0.035
  const gift = new Gift({ senderId, recipientId, postId, commentId, amount, fee })
  await gift.save()
  res.status(201).json({ message: 'Gift sent' })
}
