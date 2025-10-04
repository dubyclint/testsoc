export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  
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
    transpile: ['gun']
  },
  
  // Vite configuration for Gun.js compatibility
  vite: {
    esbuild: {
      target: 'es2020'
    },
    define: {
      global: 'globalThis',
      'process.browser': 'process.client'
    },
    optimizeDeps: {
      include: ['gun', '@supabase/supabase-js']
    },
    // Fix Gun.js CommonJS/ESM issues
    ssr: {
      noExternal: ['gun']
    }
  },
  
  // Nitro configuration for production deployment  
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
    sourceMap: process.env.NODE_ENV !== 'production',
    // Ensure proper server output
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    }
  },
  
  // Server configuration for Zeabur
  server: {
    host: process.env.NUXT_HOST || '0.0.0.0',
    port: process.env.NUXT_PORT || 8080
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'
    }
  }
});
