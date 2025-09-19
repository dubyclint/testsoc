export default defineEventHandler(async (event) => {
  const method = event.req.method
  const dbRanks = db.collection('rankConfig')

  if (method === 'GET') {
    return await dbRanks.find().sort({ points: 1 }).toArray()
  }

  const { action, rank, points } = await readBody(event)

  if (action === 'add') {
    await dbRanks.insertOne({ rank, points })
  } else if (action === 'remove') {
    await dbRanks.deleteOne({ rank })
  } else if (action === 'update') {
    await dbRanks.updateOne({ rank }, { $set: { points } })
  }

  return { success: true }
})
