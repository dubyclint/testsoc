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
    typeCheck: true
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
      supabaseUrl: process.env.https://cvzrhucbvezqwbesthek.supabase.co,
      supabaseAnonKey: process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2enJodWNidmV6cXdiZXN0aGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzgzMjYsImV4cCI6MjA3NDk1NDMyNn0.3k5QE5wTb0E52CqNxwt_HaU9jUGDlYsHWuP7rQVjY4I
,
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

