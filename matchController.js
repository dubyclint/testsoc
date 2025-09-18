const MatchRequest = require('../models/MatchRequest')

exports.submitRequest = async (req, res) => {
  const { userId, gender, ageRange, reason, isPremium } = req.body
  const request = new MatchRequest({ userId, gender, ageRange, reason, isPremium })
  await request.save()
  res.status(201).json(request)
}
