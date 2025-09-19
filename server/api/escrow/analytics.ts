import { defineEventHandler } from 'h3'
import { connectDB } from '@/server/utils/db' // adjust path if needed

export default defineEventHandler(async () => {
  const db = await connectDB()
  const collection = db.collection('escrowDeals')

  const now = new Date()
  const months = []
  const volume = []
  const releaseTime = []

  for (let i = 3; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

    const deals = await collection.find({
      timestamp: { $gte: start, $lt: end }
    }).toArray()

    const totalVolume = deals.reduce((sum, d) => sum + d.amount, 0)
    const avgReleaseTime = deals
      .filter(d => d.isReleased && d.releasedAt)
      .map(d => (new Date(d.releasedAt).getTime() - new Date(d.timestamp).getTime()) / 3600000)

    months.push(start.toLocaleString('default', { month: 'short' }))
    volume.push(Math.round(totalVolume))
    releaseTime.push(
      avgReleaseTime.length
        ? parseFloat((avgReleaseTime.reduce((a, b) => a + b, 0) / avgReleaseTime.length).toFixed(2))
        : 0
    )
  }

  return { months, volume, releaseTime }
})
