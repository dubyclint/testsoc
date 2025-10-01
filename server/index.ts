import express from 'express'
import feedRoutes from './routes/feed'

const app = express()
app.use(feedRoutes)

const requiredEnv = ['SQLITE_DB_PATH']
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`)
})

app.listen(3000, () => console.log('✅ Server running on port 3000'))
