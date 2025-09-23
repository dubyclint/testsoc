import express from 'express'
import { EthClient } from '../../lib/eth-client'
import abi from '../../scripts/abi.json'

const router = express.Router()

const client = new EthClient({
  providerUrl: process.env.PROVIDER_URL!,
  privateKey: process.env.PRIVATE_KEY!,
  contractAddress: process.env.CONTRACT_ADDRESS!,
  abi,
  client: process.env.ETH_CLIENT_TYPE as 'ethers' | 'web3'
})

// GET /api/contract/read?method=getValue
router.get('/read', async (req, res) => {
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
  const { method, args = [] } = req.body

  try {
    const result = await client.write(method, ...args)
    res.json({ success: true, tx: result })
  } catch (err) {
    res.status(500).json({ error: 'Write failed', details: err })
  }
})

// GET /api/contract/listen?event=ValueChanged
router.get('/listen', (req, res) => {
  const event = req.query.event as string
  if (!event) return res.status(400).json({ error: 'Missing event name' })

  client.listen(event, (data: any) => {
    console.log(`🔔 Event ${event}:`, data)
  })

  res.json({ listening: true, event })
})

export default router


