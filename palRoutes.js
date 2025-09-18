// server/routes/palRoutes.js
const express = require('express')
const router = express.Router()
const { sendRequest, acceptRequest } = require('../controllers/palController')

router.post('/send', sendRequest)
router.post('/accept', acceptRequest)

module.exports = router
