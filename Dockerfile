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

# Create proper directory structure for CSS files
RUN mkdir -p assets/css public/css static/css && \
    echo "/* Main CSS file */" > assets/css/main.css

# Clean up any malformed import paths in the codebase
RUN find . -type f \( -name "*.vue" -o -name "*.js" -o -name "*.ts" \) -not -path "./node_modules/*" | \
    xargs sed -i 's|~/\/assets|~/assets|g; s|@\/\/assets|@/assets|g; s|\/\/assets|/assets|g' 2>/dev/null || true

# Generate Nuxt types and prepare build
RUN npm run postinstall || npm run prepare || true

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]</parameter>
<parameter name="language">dockerfile</parameter>
</invoke>
