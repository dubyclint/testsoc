const requiredEnv = [
  'INFURA_URL',
  'ETH_PRIVATE_KEY',
  'JWT_SECRET',
  'SQLITE_DB_PATH',
  'GUI_SECRET'
]

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`)
  }
})
