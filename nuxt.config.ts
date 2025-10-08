export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/']
    },
    redirect: false
  },
  
  runtimeConfig: {
    // Server-only keys
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    fcmServerKey: process.env.FCM_SERVER_KEY,
    gunSecret: process.env.GUN_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    infuraUrl: process.env.INFURA_URL,
    ethPrivateKey: process.env.ETH_PRIVATE_KEY,
    privateKey: process.env.PRIVATE_KEY,
    
    // Public keys (available on client-side)
    public: {
      supabaseUrl: process.env.https://cvzrhucbvezqwbesthek.supabase.co,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'SocialVerse',
      apiBaseUrl: process.env.API_BASE_URL || 'https://testp.zeabur.app',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      onesignalAppId: process.env.ONESIGNAL_APP_ID,
      gunPeers: process.env.GUN_PEERS,
      providerUrl: process.env.PROVIDER_URL,
      rpcUrl: process.env.RPC_URL,
      contractAddress: process.env.CONTRACT_ADDRESS,
      ethClientType: process.env.ETH_CLIENT_TYPE || 'ethers'
    }
  },

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
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-gun': ['gun']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js', 'gun']
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
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/gun/sea.js',
          defer: true
        }
      ]
    }
  }
})

