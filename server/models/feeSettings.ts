export interface FeeSetting {
  type: 'p2p' | 'match' | 'rankHide' | 'monetization'
  makerPercent?: number
  takerPercent?: number
  flatFee?: number
  userRevenueShare?: number
  updatedAt: Date
}
