export default defineEventHandler(async (event) => {
  const method = event.req.method
  const dbCollection = db.collection('userOverrides')

  if (method === 'GET') {
    const { userId } = getQuery(event)
    return await dbCollection.find({ userId }).toArray()
  }

  if (method === 'POST') {
    const override = await readBody(event)

    if (!override.userId || !override.overrideType || !override.key) {
      return { success: false, message: 'Missing required fields.' }
    }

    override.updatedAt = new Date()
    override.createdAt = override.createdAt || new Date()

    await dbCollection.updateOne(
      {
        userId: override.userId,
        overrideType: override.overrideType,
        key: override.key
      },
      { $set: override },
      { upsert: true }
    )

    return { success: true, message: 'Override saved.' }
  }

  if (method === 'DELETE') {
    const { userId, key } = await readBody(event)
    await dbCollection.deleteOne({ userId, key })
    return { success: true, message: 'Override removed.' }
  }
})
