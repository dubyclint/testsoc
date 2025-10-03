FROM node:22-alpine AS base
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Clean any existing build artifacts
RUN rm -rf .nuxt .output dist

# Ensure required directories exist
RUN mkdir -p assets/css database && \
    if [ ! -f assets/css/main.css ]; then \
        echo "/* Main stylesheet */" > assets/css/main.css; \
    fi

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la .output/server/ && \
    if [ ! -f .output/server/index.mjs ]; then \
        echo "ERROR: .output/server/index.mjs not found after build" && \
        ls -la .output/ && \
        exit 1; \
    fi

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=base /app/.output /app/.output
COPY --from=base /app/package.json /app/package.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# Change ownership
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", ".output/server/index.mjs"]
