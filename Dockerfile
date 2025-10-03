FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create missing assets directory and CSS file if needed
RUN mkdir -p assets/css && \
    touch assets/css/main.css

# Build the Nuxt.js application
RUN npm run build

# Expose port 3000 (Nuxt.js default)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]</parameter>
<parameter name="language">dockerfile</parameter>
</invoke>
