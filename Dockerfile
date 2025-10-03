FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

# Install system dependencies for build
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Clean any existing build artifacts
RUN rm -rf .nuxt .output dist

# Ensure required directories and files exist
RUN mkdir -p assets/css database scripts && \
    if [ ! -f assets/css/main.css ]; then \
        echo "/* Main stylesheet */" > assets/css/main.css; \
    fi

# Build the application
RUN npm run build

# Verify build output using our custom script
RUN npm run verify

# Production stage
FROM node:22-alpine AS production

# Install runtime dependencies only
RUN apk add --no-cache \
    dumb-init \
    curl

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

# Double-check that server file exists in production stage
RUN ls -la .output/server/ && \
    test -f .output/server/index.mjs || (echo "ERROR: Server file missing in production stage" && exit 1)

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 -G nodejs

# Set correct ownership
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port
EXPOSE 3000

# Set production environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV PORT=3000

# Health check with proper endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", ".output/server/index.mjs"]
