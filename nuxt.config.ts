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
  
  // Build configuration
  build: {
    transpile: ['@supabase/supabase-js']
  },
  
  // Vite configuration
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
  
  // Nitro configuration - THIS IS KEY for fixing the build issue
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
    minify: false,
    sourceMap: false,
    // Ensure proper server output
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
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
