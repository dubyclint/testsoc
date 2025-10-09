// nuxt.config.ts
export default defineNuxtConfig({
  // CRITICAL: This ensures Node.js server output instead of serverless
  nitro: {
    preset: 'node-server'
  },

  // Your existing modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],

  // Supabase configuration
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/']
    }
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Development tools
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Build configuration
  build: {
    transpile: ['emoji-js']
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    // Add your private environment variables here
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },

  // App configuration
  app: {
    head: {
      title: 'SocialVerse',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SocialVerse - Connect and Share' }
      ]
    }
  },

  // Server-side rendering configuration
  ssr: true,

  // Experimental features (if needed)
  experimental: {
    payloadExtraction: false
  }
})


