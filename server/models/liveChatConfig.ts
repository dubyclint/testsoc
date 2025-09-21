export interface LiveChatConfig {
  method: 'widget' | 'native' | 'redirect'
  label: string
  script?: string         // for widget
  url?: string            // for redirect
  active: boolean
  region?: string         // optional targeting
  updatedAt: Date
}
