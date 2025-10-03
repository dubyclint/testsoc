FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Ensure required directories exist
RUN mkdir -p assets/css database && \
    if [ ! -f assets/css/main.css ]; then \
        echo "/* Main stylesheet */" > assets/css/main.css; \
    fi

# Set Node.js options for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the Nuxt application
RUN npm run build

# Expose port 3000 for the main application
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the Nuxt application
CMD ["npm", "start"]
