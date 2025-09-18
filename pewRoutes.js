// server/routes/pewRoutes.js
const express = require('express')
const router = express.Router()
const { createPew } = require('../controllers/pewController')

router.post('/create', createPew)

module.exports = router
