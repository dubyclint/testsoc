// server/routes/p2pRoutes.js
const express = require('express')
const router = express.Router()
const { submitProfile } = require('../controllers/p2pController')

router.post('/submit', submitProfile)
module.exports = router
