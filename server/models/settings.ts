export interface UserSetting {
  userId: string
  key: string           // e.g. 'language', 'notifications.email'
  value: any
  updatedAt: Date
}

export interface GlobalSetting {
  key: string           // e.g. 'maxP2PAmount', 'defaultLanguage'
  value: any
  updatedAt: Date
  updatedBy: string     // adminId
}
