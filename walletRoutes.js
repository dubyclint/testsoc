// server/routes/walletRoutes.js
const express = require('express')
const router = express.Router()
const { createWallets } = require('../controllers/walletController')

router.post('/wallets/create', createWallets)

module.exports = router
