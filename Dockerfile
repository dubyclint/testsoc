Dockerfile
FROM node:20-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
