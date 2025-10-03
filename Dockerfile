FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Ensure the assets/css/main.css file exists
RUN mkdir -p assets/css && \
    if [ ! -f assets/css/main.css ]; then \
        echo "/* Main stylesheet */" > assets/css/main.css; \
    fi

# Build the Nuxt application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
