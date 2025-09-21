export default defineEventHandler(async (event) => {
  const method = event.req.method
  const userId = getHeader(event, 'x-user-id') || 'anonymous'
  const dbUser = db.collection('userSettings')
  const dbGlobal = db.collection('globalSettings')

  if (method === 'GET') {
    const scope = getQuery(event).scope
    if (scope === 'user') {
      return await dbUser.find({ userId }).toArray()
    }
    if (scope === 'global') {
      return await dbGlobal.find({}).toArray()
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { scope, key, value, adminId } = body

    if (scope === 'user') {
      await dbUser.updateOne(
        { userId, key },
        { $set: { value, updatedAt: new Date() } },
        { upsert: true }
      )
    }

    if (scope === 'global') {
      await dbGlobal.updateOne(
        { key },
        { $set: { value, updatedAt: new Date(), updatedBy: adminId || 'system' } },
        { upsert: true }
      )
    }

    return { success: true }
  }
})
