export interface SupportContact {
  label: string       // e.g. 'Support Email', 'WhatsApp Nigeria'
  value: string       // e.g. 'support@socialverse.com', '+2348012345678'
  type: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'other'
  region?: string     // optional: e.g. 'Nigeria', 'Global'
  updatedAt: Date
}
