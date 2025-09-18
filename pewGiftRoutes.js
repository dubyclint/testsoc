const express = require('express')
const router = express.Router()
const { sendGift } = require('../controllers/pewGiftController')

router.post('/send', sendGift)
module.exports = router
