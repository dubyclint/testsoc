// plugins/gun.client.js
export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (process.server) return

  // Import your existing Gun client
  const { gun, sea, ensureUserPair, getUserPub } = await import('~/gundb/client.js')

  return {
    provide: {
      gun,
      sea,
      ensureUserPair,
      getUserPub
    }
  }
})
