#!/bin/bash

# Local build script for development
set -e

echo "🔧 Building Socialverse locally..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build with verification
echo "🏗️  Building application..."
npm run build:verify

echo "✅ Local build completed successfully!"
echo "🚀 Start the app with: npm start"
chmod +x scripts/docker-build.sh
chmod +x scripts/build-local.sh
