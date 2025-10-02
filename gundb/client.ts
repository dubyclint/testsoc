import Gun from 'gun/gun'
import SEA from 'gun/sea'

export const gun = Gun(['https://gun-manhattan.herokuapp.com/gun'])
export const sea = SEA

// Ensure the current user has a SEA keypair stored locally and publish their public key to Gun.
export async function ensureUserPair(userId: string) {
  const key = `sea_pair_${userId}`
  let pair = localStorage.getItem(key)
  if (!pair) {
    const newPair = await sea.pair()
    localStorage.setItem(key, JSON.stringify(newPair))
    pair = JSON.stringify(newPair)
    // Publish public key for invites and shared secrets
    gun.get(`users/${userId}`).put({ pub: newPair.pub })
  }
  return JSON.parse(pair)
}

// Helper to get a user's published public key from Gun
export async function getUserPub(userId: string): Promise<string | null> {
  return new Promise((resolve) => {
    gun.get(`users/${userId}`).once((data) => {
      resolve(data?.pub || null)
    })
  })
}
