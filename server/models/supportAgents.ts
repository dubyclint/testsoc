export interface SupportAgent {
  agentId: string
  name: string
  contact: string
  method: 'native' | 'widget' | 'redirect'
  assignedFeatures: string[] // e.g. ['p2p', 'wallet', 'monetization']
  region?: string            // optional: e.g. 'Nigeria', 'Global'
  active: boolean
  lastSeen?: Date
}
