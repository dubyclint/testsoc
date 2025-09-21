export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    return await db.collection('supportContacts').find({}).toArray()
  }

  if (event.req.method === 'POST') {
    const contacts = await readBody(event)
    await db.collection('supportContacts').deleteMany({})
    await db.collection('supportContacts').insertMany(contacts)
    return { success: true }
  }
})
