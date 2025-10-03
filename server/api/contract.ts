import { supabase } from "~/server/utils/database"
import express from 'express'
import { EthClient } from '../../lib/eth-client'
import abi from '../../scripts/abi.json'

const router = express.Router()

// Initialize ETH client only if environment variables are present
let client: EthClient | null = null

if (process.env.PROVIDER_URL && process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS) {
  client = new EthClient({
    providerUrl: process.env.PROVIDER_URL,
    privateKey: process.env.PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    abi,
    client: (process.env.ETH_CLIENT_TYPE as 'ethers' | 'web3') || 'ethers'
  })
}

// GET /api/contract/read?method=getValue
router.get('/read', async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'ETH client not configured' })
  }

  const method = req.query.method as string
  const args = req.query.args ? JSON.parse(req.query.args as string) : []

  try {
    const result = await client.read(method, ...args)
    res.json({ result })
  } catch (err) {
    res.status(500).json({ error: 'Read failed', details: err })
  }
})

// POST /api/contract/write
router.post('/write', express.json(), async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'ETH client not configured' })
  }

  const { method, args = [] } = req.body

  try {
    const result = await client.write(method, ...args)
    res.json({ success: true, tx: result })
  } catch (err) {
    res.status(500).json({ error: 'Write failed', details: err })
  }
})

export default router
