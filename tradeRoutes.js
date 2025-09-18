// server/routes/tradeRoutes.js
const express = require('express')
const router = express.Router()
const { createTrade } = require('../controllers/tradeController')

router.post('/create', createTrade)
module.exports = router
