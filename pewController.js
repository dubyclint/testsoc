const Pew = require('../models/Pew')

exports.createPew = async (req, res) => {
  const { userId, title, content, mediaUrl, tags } = req.body
  const pew = new Pew({ userId, title, content, mediaUrl, tags, rankScore: 0 })
  await pew.save()
  res.status(201).json(pew)
}

exports.rankPews = async () => {
  const pews = await Pew.find()
  pews.forEach(async (pew) => {
    const score = pew.likes.length + pew.comments.length + (pew.content.length / 100)
    pew.rankScore = score
    await pew.save()
  })
}
