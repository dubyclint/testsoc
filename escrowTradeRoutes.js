const express = require('express')
const router = express.Router()
const {
  createTrade,
  getEscrowHistory,
  getEscrowStatus
} = require('../controllers/escrowTradeController')

router.post('/create', createTrade)
router.get('/history', getEscrowHistory)
router.get('/status', getEscrowStatus)

module.exports = router
