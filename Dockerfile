FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl \
    dumb-init

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (use npm install since no package-lock.json exists)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8080
ENV PORT=8080

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 -G nodejs

# Set correct ownership
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose port 8080 (Zeabur standard)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", ".output/server/index.mjs"]
