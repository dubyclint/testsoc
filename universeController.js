const UniverseMessage = require('../models/UniverseMessage')

exports.sendMessage = async (req, res) => {
  const { senderId, country, interestTags, message } = req.body
  const msg = new UniverseMessage({ senderId, country, interestTags, message })
  await msg.save()
  res.status(201).json(msg)
}

exports.getMessages = async (req, res) => {
  const { country, interestTags } = req.query
  const messages = await UniverseMessage.find({
    country,
    interestTags: { $in: interestTags }
  }).sort({ timestamp: -1 }).limit(50)
  res.status(200).json(messages)
}
