const Post = require('../models/Post')

exports.createPost = async (req, res) => {
  const { userId, content, mediaUrl, type } = req.body
  const post = new Post({ userId, content, mediaUrl, type })
  await post.save()
  res.status(201).json(post)
}

exports.likePost = async (req, res) => {
  const { postId, userId } = req.body
  await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } })
  res.status(200).json({ message: 'Liked' })
}
