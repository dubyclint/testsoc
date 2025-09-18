// server/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const walletRoutes = require('./routes/walletRoutes')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/socialverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use('/api', walletRoutes)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
