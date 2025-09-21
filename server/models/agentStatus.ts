export interface AgentStatus {
  agentId: string
  online: boolean
  lastSeen: Date
  currentSessions: number
  maxSessions: number
}
