// Your existing nuxt.config.ts - keep everything as is, just add this:
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  
  // ADD ONLY THIS BLOCK - don't touch anything else
  supabase: {
    url: 'https://cvzrhucbvezqwbesthek.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2enJodWNidmV6cXdiZXN0aGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzgzMjYsImV4cCI6MjA3NDk1NDMyNn0.3k5QE5wTb0E52CqNxwt_HaU9jUGDlYsHWuP7rQVjY4I',
    redirect: false
  },
  
  // Runtime configuration - KEEP AS IS
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SocialVerse'
    }
  },

  // KEEP ALL YOUR EXISTING CONFIGURATION EXACTLY AS IS
  pinia: {
    storesDirs: ['./stores/**']
  },
  ssr: true,
  build: {
    transpile: ['@supabase/supabase-js']
  },
  vite: {
    define: {
      global: 'globalThis'
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: ['gun'],
        output: {
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
  css: ['~/assets/css/main.css'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    experimental: {
      wasm: true
    }
  },
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
