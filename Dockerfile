# Use stable Node.js 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build Nuxt for production (generates .output and nitro.json)
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Expose default Nuxt port
EXPOSE 3000

# Start Nuxt server
CMD ["npm", "run", "start"]
