import express from 'express'
const router = express.Router()
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.env.SQLITE_DB_PATH || './data/socialverse.db')
const db = new Database(dbPath)

router.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page as string || '1')
  const limit = 10
  const offset = (page - 1) * limit
  const posts = db.prepare('SELECT id, content FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset)
  res.json(posts)
})

router.post('/api/posts', express.json(), (req, res) => {
  const { content } = req.body
  const stmt = db.prepare('INSERT INTO posts (content, created_at) VALUES (?, ?)')
  const info = stmt.run(content, Date.now())
  res.json({ id: info.lastInsertRowid, content })
})

export default router
