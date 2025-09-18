const express = require('express')
const router = express.Router()
const { getWallet } = require('../controllers/userWalletController')

router.get('/get', getWallet)
module.exports = router
