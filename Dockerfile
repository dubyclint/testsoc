FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build -- --verbose

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

