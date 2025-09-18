const express = require('express')
const router = express.Router()
const { verifyUser, flagPost, approveMatch } = require('../controllers/adminController')

router.post('/verify-user', verifyUser)
router.post('/flag-post', flagPost)
router.post('/approve-match', approveMatch)

module.exports = router
