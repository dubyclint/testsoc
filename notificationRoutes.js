const express = require('express')
const router = express.Router()
const { getNotifications, markRead } = require('../controllers/notificationController')

router.get('/list', getNotifications)
router.post('/read', markRead)

module.exports = router
