// scripts/fix-build-warnings.js
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'

console.log('🔧 Fixing build warnings...')

// Remove duplicate supabase files
if (existsSync('utils/supabase.js') && existsSync('utils/supabase.ts')) {
  console.log('📁 Removing duplicate supabase.js (keeping .ts version)')
  unlinkSync('utils/supabase.js')
}

// Clean components/index.ts
const componentsIndex = `// components/index.ts - Auto-generated
export { default as AdSlot } from './AdSlot.vue'
export { default as AdminAdAnalytics } from './AdminAdAnalytics.vue'
export { default as ChatBox } from './ChatBox.vue'
export { default as ExploreGrid } from './ExploreGrid.vue'
export { default as PostDetail } from './PostDetail.vue'
export { default as RankAdminPanel } from './RankAdminPanel.vue'
export { default as TradeListings } from './TradeListings.vue'
export { default as UserInbox } from './UserInbox.vue'
export { default as VerifiedBadgeAdmin } from './VerifiedBadgeAdmin.vue'
`

writeFileSync('components/index.ts', componentsIndex)

console.log('✅ Build warnings fixed!')
console.log('🚀 Run: npm run build to test the fixes')
