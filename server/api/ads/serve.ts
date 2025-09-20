const metrics = await db.collection('adMetrics').find({
  action: 'variant',
  ...(page && { page }),
  ...(region && { region }),
  ...(startDate && { timestamp: { $gte: new Date(startDate).getTime() } }),
  ...(endDate && { timestamp: { ...timestamp, $lte: new Date(endDate).getTime() } })
}).toArray()

const formats = ['image', 'video', 'text', 'audio', 'external']
const formatStats = formats.map(format => {
  const filtered = metrics.filter(m => m.variant === format)
  const clicks = filtered.filter(m => m.action === 'click').length
  const impressions = filtered.length
  const ctr = impressions ? clicks / impressions : 0
  return { format, ctr }
})

const topFormat = formatStats.sort((a, b) => b.ctr - a.ctr)[0]?.format
const boostedAds = allowedAds.filter(ad => ad.type === topFormat)

const sorted = boostedAds.sort((a, b) => (b.bid || 0) - (a.bid || 0))
return sorted.slice(0, 1)
