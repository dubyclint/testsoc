// server/routes/escrowRoutes.js
const express = require('express')
const router = express.Router()
const { createEscrow } = require('../controllers/escrowController')

router.post('/create', createEscrow)
module.exports = router
