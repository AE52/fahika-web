# Frontend için Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm ci --only=production

# Kaynak kodları kopyala
COPY . .

# Build için gerekli ortam değişkenleri
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    API_URL=https://api.fahika.com

# Next.js uygulamasını build et
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

# Production ortam değişkenleri
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Port 3000'i dinle
EXPOSE 3000

# Health check ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Uygulamayı başlat
CMD ["npm", "start"] 