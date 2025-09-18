// server/routes/matchRoutes.js
const express = require('express')
const router = express.Router()
const { submitRequest } = require('../controllers/matchController')

router.post('/submit', submitRequest)
module.exports = router
