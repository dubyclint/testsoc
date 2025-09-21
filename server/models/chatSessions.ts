export interface ChatSession {
  sessionId: string
  userId: string
  agentId?: string
  startedAt: Date
  endedAt?: Date
  status: 'open' | 'closed' | 'escalated'
  messages: {
    sender: 'user' | 'agent'
    content: string
    timestamp: Date
  }[]
  escalatedTo?: string // senior agent ID
}
