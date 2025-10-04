export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  
  // SSR Configuration
  ssr: true,
  
  // Add required modules
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // Add CSS
  css: ['~/assets/css/main.css'],
  
  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },
  
  // Build configuration
  build: {
    transpile: []
  },
  
  // Vite configuration
  vite: {
    esbuild: {
      target: 'es2020'
    },
    define: {
      global: 'globalThis',
      'process.browser': 'process.client'
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
      exclude: ['gun']  // Exclude Gun.js from optimization
    },
    ssr: {
      noExternal: [],
      external: ['gun']  // Keep Gun.js external for SSR
    }
  },
  
  // Nitro configuration
  nitro: {
    preset: 'node-server',
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    minify: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  
  // Server configuration
  server: {
    host: process.env.NUXT_HOST || '0.0.0.0',
    port: process.env.NUXT_PORT || 8080
  },
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || '',
    fcmServerKey: process.env.FCM_SERVER_KEY || '',
    
    // Public keys (client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'
    }
  }
});
