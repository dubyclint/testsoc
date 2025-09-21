// Updated schema for premium access rules
export interface PremiumAccessRule {
  target: 'country' | 'region' | 'geo' | 'all'
  value: string // e.g. 'Nigeria', 'Rivers', '6.45,3.39'
  features: {
    p2p?: boolean
    matching?: boolean
    rankHide?: boolean
  }
  active: boolean
  createdAt: Date
  updatedAt: Date
}
