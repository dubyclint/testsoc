// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      appBaseUrl: process.env.NUXT_APP_BASE_URL || 'http://localhost:3000',
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
