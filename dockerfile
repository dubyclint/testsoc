FROM node:22

# Build arguments to receive environment variables during build
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NUXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Set environment variables for the build process
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_ANON_KEY=$NUXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

LABEL "language"="nodejs"
LABEL "framework"="nuxt"
WORKDIR /src
RUN npm install -f -g yarn@latest
COPY . .
RUN yarn install
RUN NITRO_PRESET=node-server yarn build
EXPOSE 8080
CMD ["yarn", "start"]

