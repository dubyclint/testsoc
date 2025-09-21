export default defineEventHandler(async (event) => {
  const method = event.req.method
  const db = db.collection('translations')

  if (method === 'GET') {
    const { lang } = getQuery(event)
    return await db.find({ language: lang }).toArray()
  }

  if (method === 'POST') {
    const entry = await readBody(event)

    if (!entry.key || !entry.language || !entry.value) {
      return { success: false, message: 'Missing fields.' }
    }

    entry.updatedAt = new Date()
    await db.updateOne(
      { key: entry.key, language: entry.language },
      { $set: entry },
      { upsert: true }
    )

    return { success: true, message: 'Translation saved.' }
  }
})

