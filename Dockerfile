# ==========================================
# 1. Build Backend
# ==========================================
FROM node:24-bullseye-slim AS backend-builder
WORKDIR /app/backend

COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY backend/ ./
RUN yarn db:gen
RUN yarn build

# Backend production dependencies
FROM node:24-bullseye-slim AS backend-prod-deps
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --production --frozen-lockfile

# ==========================================
# 2. Build Frontend
# ==========================================
FROM oven/bun:1.3 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN bun run build

# Frontend production dependencies
FROM oven/bun:1.3 AS frontend-prod-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --production --frozen-lockfile

# ==========================================
# 3. Single Common Runner (Backend + Frontend)
# ==========================================
FROM node:24-bullseye-slim AS runner

# Install Bun binary for Next.js execution
COPY --from=oven/bun:1.3 /usr/local/bin/bun /usr/local/bin/bun
COPY --from=oven/bun:1.3 /usr/local/bin/bunx /usr/local/bin/bunx

WORKDIR /app

# Backend artifacts
WORKDIR /app/backend
COPY --from=backend-prod-deps /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/prisma.config.ts ./prisma.config.ts
COPY backend/package.json ./

# Frontend artifacts
WORKDIR /app/frontend
COPY --from=frontend-prod-deps /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/next.config.ts ./next.config.ts
COPY frontend/package.json ./

WORKDIR /app
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 4000 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
