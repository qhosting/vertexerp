

# ===========================================
# Dockerfile Multi-Stage para Next.js
# VertexERP v4.0
# ===========================================

# Stage 1: Dependencias
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl bash

WORKDIR /app

# Copiar archivos de dependencias y backup de yarn.lock
COPY app/package.json ./
COPY .yarn-backup/yarn.lock.master ./yarn.lock.backup

# Intentar copiar yarn.lock del directorio app (si existe y es válido)
COPY app/yarn.lock* ./

# Script para asegurar que yarn.lock existe y es válido
# Si yarn.lock no existe o es un symlink, usar el backup
RUN if [ ! -f yarn.lock ] || [ -L yarn.lock ]; then \
        echo "⚠️  yarn.lock no válido, usando backup master..."; \
        cp yarn.lock.backup yarn.lock; \
    fi && \
    echo "✅ yarn.lock verificado como archivo real:" && \
    ls -lh yarn.lock && \
    echo "Total de líneas: $(wc -l < yarn.lock)"

# Instalar dependencias con versiones exactas
# El --frozen-lockfile asegura que las versiones sean exactamente las del lockfile
RUN yarn install --frozen-lockfile --network-timeout 300000 --production=false

# Stage 2: Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY app/ ./

# Variables de entorno necesarias para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar Prisma Client
RUN yarn prisma generate

# Build de Next.js en modo standalone
RUN yarn build

# Stage 3: Runner (Producción)
FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl

WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar archivos del build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar Prisma schema y client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copiar script de inicio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicio
CMD ["./start.sh"]
