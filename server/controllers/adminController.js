exports.verifyUser = async (req, res) => {
  const { userId, verified } = req.body
  await User.findByIdAndUpdate(userId, { isVerified: verified })
  res.status(200).json({ message: 'User verification updated' })
}

exports.flagPost = async (req, res) => {
  const { postId } = req.body
  await Post.findByIdAndUpdate(postId, { flagged: true })
  res.status(200).json({ message: 'Post flagged' })
}

exports.approveMatch = async (req, res) => {
  const { requestId, matchedUserId } = req.body
  await MatchRequest.findByIdAndUpdate(requestId, {
    matchedUserId,
    approvedByAdmin: true
  })
  res.status(200).json({ message: 'Match approved' })
}
