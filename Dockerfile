FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

# Install system dependencies for better-sqlite3 and other native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Ensure required directories exist
RUN mkdir -p data keys assets/css && \
    if [ ! -f assets/css/main.css ]; then \
        echo "/* Main stylesheet */" > assets/css/main.css; \
    fi

# Create default SQLite database directory
RUN mkdir -p data && touch data/socialverse.db

# Build the Nuxt application
RUN npm run build

# Expose ports for the application and GunDB
EXPOSE 3000 8765

# Set environment variables
ENV NODE_ENV=production
ENV SQLITE_DB_PATH=/app/data/socialverse.db
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application using PM2 for production
CMD ["npm", "run", "start:pm2"]
