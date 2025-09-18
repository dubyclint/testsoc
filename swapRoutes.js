// server/routes/swapRoutes.js
const express = require('express')
const router = express.Router()
const { swapCrypto } = require('../controllers/swapController')

router.post('/swap', swapCrypto)
module.exports = router
