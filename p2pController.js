const P2PProfile = require('../models/P2PProfile')

exports.submitProfile = async (req, res) => {
  const { userId, acceptedCurrencies } = req.body
  const profile = new P2PProfile({ userId, acceptedCurrencies, kycVerified: false, isActive: false })
  await profile.save()
  res.status(201).json(profile)
}
