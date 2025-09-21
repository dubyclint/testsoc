export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    return await db.collection('termsAndPolicies').find({}).toArray()
  }

  if (event.req.method === 'POST') {
    const { feature, content } = await readBody(event)
    await db.collection('termsAndPolicies').updateOne(
      { feature },
      { $set: { content, lastUpdated: new Date() } },
      { upsert: true }
    )
    return { success: true }
  }
})
