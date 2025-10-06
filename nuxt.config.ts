// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SocialVerse'
    }
  },

  supabase: {
    redirect: false,
    clientOptions: {
      auth: {
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  ssr: true,
  
  build: {
    transpile: []
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-supabase': ['@supabase/supabase-js']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
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
    compressPublicAssets: true
  }
})


