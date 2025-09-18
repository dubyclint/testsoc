// server/routes/giftRoutes.js
const express = require('express')
const router = express.Router()
const { sendGift } = require('../controllers/giftController')

router.post('/send', sendGift)

module.exports = router
