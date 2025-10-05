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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SocialVerse'
    }
  },

  // Supabase module configuration
  supabase: {
    redirect: false
  },

  // Pinia configuration (added this)
  pinia: {
    storesDirs: ['./stores/**']
  },

  // SSR configuration to prevent hydration issues
  ssr: true,
  
  // Build optimization (REMOVED pinia from transpile - this was causing the conflict)
  build: {
    transpile: ['@supabase/supabase-js'] // Only Supabase, not pinia
  },

  // Vite configuration for bundle optimization  
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Clean vendor chunks
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-supabase': ['@supabase/supabase-js'],
            // REMOVED pinia from manual chunks since @pinia/nuxt handles it
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
