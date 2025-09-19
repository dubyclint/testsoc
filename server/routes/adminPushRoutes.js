const express = require('express')
const router = express.Router()
const {
  pushMatchApproved,
  pushPostFlagged,
  pushEscrowReleased,
  pushEscrowRefunded
} = require('../controllers/adminPushController')

router.post('/match-approved', pushMatchApproved)
router.post('/post-flagged', pushPostFlagged)
router.post('/escrow-released', pushEscrowReleased)
router.post('/escrow-refunded', pushEscrowRefunded)

module.exports = router
