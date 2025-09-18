const PewGift = require('../models/PewGift')

exports.sendGift = async (req, res) => {
  const { senderId, recipientId, postId, commentId, amount } = req.body

  let split = { toCommenter: 0, toPostOwner: amount }
  if (commentId) {
    split.toCommenter = amount * 0.7
    split.toPostOwner = amount * 0.3
  }

  const gift = new PewGift({ senderId, recipientId, postId, commentId, amount, split })
  await gift.save()

  res.status(201).json({ message: 'Gift sent', split })
}
