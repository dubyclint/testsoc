import express from 'express'
import { getSettings, saveSetting } from '../db/index'

const router = express.Router()

// GET /api/settings?scope=user
router.get('/', (req, res) => {
  const scope = req.query.scope as string
  if (!scope) return res.status(400).json({ error: 'Missing scope' })

  try {
    const settings = getSettings(scope)
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' })
  }
})

// POST /api/settings
router.post('/', express.json(), (req, res) => {
  const { scope, key, value } = req.body
  if (!scope || !key) return res.status(400).json({ error: 'Missing scope or key' })

  try {
    saveSetting(scope, key, value)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save setting' })
  }
})

export default router
