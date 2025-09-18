const express = require('express')
const router = express.Router()
const {
  verifyUser,
  getUsers,
  flagPost,
  getPosts,
  getMatchRequests,
  approveMatch,
  getEscrowDeals
} = require('../controllers/dashboardAdminController')

router.post('/verify-user', verifyUser)
router.get('/users', getUsers)

router.post('/flag-post', flagPost)
router.get('/posts', getPosts)

router.get('/match-requests', getMatchRequests)
router.post('/approve-match', approveMatch)

router.get('/escrow-deals', getEscrowDeals)

module.exports = router
