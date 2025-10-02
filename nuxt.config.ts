import Inspect from 'vite-plugin-inspect';

export default defineNuxtConfig({
  modules: [],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  vite: {
    logLevel: 'info',
    plugins: [Inspect()]
  }
});
