export default defineEventHandler(async (event) => {
  const method = event.req.method
  const db = db.collection('chatSessions')

  if (method === 'POST') {
    const body = await readBody(event)

    if (body.action === 'start') {
      const session = {
        sessionId: crypto.randomUUID(),
        userId: body.userId,
        agentId: body.agentId,
        startedAt: new Date(),
        status: 'open',
        messages: []
      }
      await db.insertOne(session)
      return session
    }

    if (body.action === 'message') {
      await db.updateOne(
        { sessionId: body.sessionId },
        {
          $push: {
            messages: {
              sender: body.sender,
              content: body.content,
              timestamp: new Date()
            }
          }
        }
      )
      return { success: true }
    }

    if (body.action === 'end') {
      await db.updateOne(
        { sessionId: body.sessionId },
        { $set: { status: 'closed', endedAt: new Date() } }
      )
      return { success: true }
    }

    if (body.action === 'escalate') {
      const senior = await db.collection('supportAgents').findOne({
        assignedFeatures: 'escalation',
        active: true
      })

      await db.updateOne(
        { sessionId: body.sessionId },
        {
          $set: {
            status: 'escalated',
            escalatedTo: senior.agentId
          },
          $push: {
            messages: {
              sender: 'system',
              content: `Session escalated to ${senior.name}`,
              timestamp: new Date()
            }
          }
        }
      )
      return { success: true }
    }
  }

  if (method === 'GET') {
    const { userId } = getQuery(event)
    return await db.find({ userId }).sort({ startedAt: -1 }).toArray()
  }
})
