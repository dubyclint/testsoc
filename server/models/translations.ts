export interface TranslationEntry {
  key: string               // e.g. 'support.title', 'chat.send'
  language: string          // e.g. 'en', 'fr', 'ha', 'zh'
  value: string             // Translated string
  updatedAt: Date
  updatedBy: string         // adminId
}
