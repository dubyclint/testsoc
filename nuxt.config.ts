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

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**']
  },

  // SSR configuration
  ssr: true,
  
  // Build configuration
  build: {
    transpile: ['@supabase/supabase-js']
  },

  // Vite configuration for bundle optimization  
  vite: {
    define: {
      global: 'globalThis'
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: ['gun'],
        output: {
          // Clean vendor chunks
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-supabase': ['@supabase/supabase-js']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
      exclude: ['gun']
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
    compressPublicAssets: true,
    experimental: {
      wasm: true
    }
  },

  // App configuration
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/gun/gun.min.js',
          defer: true
        }
      ]
    }
  }
})

