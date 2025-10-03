export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Add required modules
  modules: [
    '@pinia/nuxt'
  ],
  
  // Add CSS
  css: ['~/assets/css/main.css'],
  
  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },
  
  // Build configuration with polyfills
  build: {
    transpile: []
  },
  
  // Vite configuration with polyfills
  vite: {
    esbuild: {
      target: 'es2020'
    },
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  },
  
  // Nitro configuration for serverless functions
  nitro: {
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  },
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || '',
    fcmServerKey: process.env.FCM_SERVER_KEY || '',
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  }
});
