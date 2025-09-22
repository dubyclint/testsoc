#!/bin/bash

echo "🚀 Deploying socialverse-web backend..."

cd /var/www/socialverse-web
git pull origin main
pnpm install
ts-node server/db/migrate.ts
pm2 start gundb/server.js --name gundb-peer
pm2 restart server/index.js --name socialverse-api

echo "✅ Deployment complete."
