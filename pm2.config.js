module.exports = {
  apps: [
    {
      name: 'gundb',
      script: 'gundb/server.js',
      exec_mode: 'fork',
      autorestart: true
    },
    {
      name: 'api',
      script: 'server/index.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
