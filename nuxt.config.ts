export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },
  
  // CSS framework (only if the file exists)
  css: [],
  
  // Build configuration
  build: {
    transpile: []
  },
  
  // Vite configuration
  vite: {
    esbuild: {
      target: 'es2020'
    }
  },
  
  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  }
});
