const express = require('express')
const router = express.Router()
const {
  releaseDealWithPush,
  refundDealWithPush
} = require('../controllers/escrowPushController')

router.post('/release', releaseDealWithPush)
router.post('/refund', refundDealWithPush)

module.exports = router
