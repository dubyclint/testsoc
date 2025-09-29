import express from 'express'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'

const app = express()
app.use(express.json())
app.use(authRoutes)
app.use(adminRoutes)

const requiredEnv = ['INFURA_URL', 'ETH_PRIVATE_KEY', 'JWT_SECRET', 'SQLITE_DB_PATH', 'GUI_SECRET']
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`)
})

app.listen(3000, () => console.log('✅ Server running on port 3000'))
