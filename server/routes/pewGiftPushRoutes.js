const express = require('express')
const router = express.Router()
const { sendGiftWithPush } = require('../controllers/pewGiftPushController')

router.post('/send-with-push', sendGiftWithPush)
module.exports = router
