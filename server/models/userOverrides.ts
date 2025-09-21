export interface UserOverride {
  userId: string
  overrideType: 'premium' | 'fee' | 'monetization' | 'tier' | 'trust'
  key: string // e.g. 'p2p', 'makerPercent', 'tier'
  value: any
  reason?: string
  createdAt: Date
  updatedAt: Date
  adminId: string
}
