# Frontend için Cloud Run Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# ESLint kontrolünü devre dışı bırakarak build et
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_LINT_DURING_BUILD=false
ENV API_URL=https://api-fahika-web.run.app

RUN npm run build

# Production aşaması
FROM node:18-alpine

WORKDIR /app

# Sadece gerekli dosyaları kopyala
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Ortam değişkenlerini ayarla
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Port 8080'i dinle (Cloud Run standardı)
EXPOSE 8080

# Healthcheck ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Uygulamayı başlat
CMD ["npm", "start"] 