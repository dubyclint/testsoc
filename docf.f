FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="nuxt.js"

WORKDIR /src

RUN npm install -g pnpm@latest

COPY . .

RUN pnpm install --no-frozen-lockfile

RUN pnpm build

RUN mkdir -p /app && cp -r /src/.output /app/ && cp -r /src/node_modules /app/

WORKDIR /app

EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
