#!/bin/bash

# Docker build script for Socialverse
set -e

echo "🐳 Building Socialverse Docker image..."

# Clean up any existing containers
docker stop socialverse-web 2>/dev/null || true
docker rm socialverse-web 2>/dev/null || true

# Build the image
docker build -t socialverse-web:latest .

echo "✅ Docker image built successfully!"

# Optionally run the container
read -p "Do you want to run the container? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting container..."
    docker run -d \
        --name socialverse-web \
        -p 3000:3000 \
        --env-file .env \
        socialverse-web:latest
    
    echo "🌐 Container started! Visit http://localhost:3000"
    echo "📋 Container logs:"
    docker logs -f socialverse-web
fi
