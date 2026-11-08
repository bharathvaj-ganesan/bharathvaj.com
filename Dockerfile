# Base stage for building the static files
FROM node:26.13.0 AS base
WORKDIR /app

# Install the pnpm version used by Cloudflare Pages
RUN npm install --global pnpm@8.7.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage for serving the application
FROM nginx:mainline-alpine-slim AS runtime
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
