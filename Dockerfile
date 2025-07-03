FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# スタンドアロンモードでビルド
ENV NODE_ENV=production
ENV STANDALONE=true
ENV HOSTNAME=0.0.0.0

RUN npm run build:standalone

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV HOSTNAME 0.0.0.0
ENV STANDALONE true

# NextAuth環境変数（App Runnerで上書きされる）
ENV AUTH_SECRET="default-secret"
ENV AUTH_URL="http://localhost:3000"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["sh", "-c", "exec /usr/local/bin/node server.js"]
