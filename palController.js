const Pal = require('../models/Pal')

exports.sendRequest = async (req, res) => {
  const { requesterId, recipientId } = req.body
  const request = new Pal({ requesterId, recipientId })
  await request.save()
  res.status(201).json(request)
}

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.body
  await Pal.findByIdAndUpdate(requestId, { status: 'accepted' })
  res.status(200).json({ message: 'Pal request accepted' })
}
