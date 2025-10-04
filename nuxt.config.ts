// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2enJodWNidmV6cXdiZXN0aGVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM3ODMyNiwiZXhwIjoyMDc0OTU0MzI2fQ.4gjaVgOV9j_1PsVmylhwbqXnTm3zch6LmS4sFFGeGMg,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.https://cvzrhucbvezqwbesthek.supabase.co,
      supabaseAnonKey: process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2enJodWNidmV6cXdiZXN0aGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzgzMjYsImV4cCI6MjA3NDk1NDMyNn0.3k5QE5wTb0E52CqNxwt_HaU9jUGDlYsHWuP7rQVjY4I,
      appBaseUrl: process.env.NUXT_APP_BASE_URL || 'http://testwe.zeabur.app,
      appName: process.env.NUXT_APP_NAME || 'SocialVerse'
    }
  },

  // Build optimization
  build: {
    transpile: ['@supabase/supabase-js']
  },

  // Vite configuration for bundle optimization
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-vue': ['vue', 'vue-router', '@nuxt/kit'],
            'vendor-supabase': ['@supabase/supabase-js'],
            
            // Feature-based chunks
            'feature-trading': ['./components/TradeListings.vue'],
            'feature-social': ['./components/PostDetail.vue'],
            'feature-admin': ['./components/AdminAdAnalytics.vue'],
            'feature-wallet': ['./components/WalletSection.vue']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  },

  // CSS optimization
  css: ['~/assets/css/main.css'],

  // Component optimization
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  // Nitro configuration
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  }
})
