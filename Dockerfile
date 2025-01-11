# Frontend build aşaması
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# ESLint ve Telemetry'i devre dışı bırak
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_LINT_DURING_BUILD=false

# Next.js uygulamasını build et
RUN npm run build

# Backend build aşaması
FROM python:3.9-slim AS backend-builder

WORKDIR /app/api

# Python bağımlılıklarını yükle
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# API kaynak kodlarını kopyala
COPY api/ .

# Production aşaması
FROM node:18-alpine

WORKDIR /app

# Python ve gerekli paketleri yükle
RUN apk add --no-cache python3 py3-pip

# Frontend dosyalarını kopyala
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/next.config.js ./

# Frontend bağımlılıklarını yükle
RUN npm install --production

# Backend dosyalarını kopyala
COPY --from=backend-builder /app/api /app/api
RUN pip3 install --no-cache-dir -r /app/api/requirements.txt gunicorn

# Başlatma scriptini oluştur
RUN echo '#!/bin/sh\n\
cd /app/api && python3 -m gunicorn --bind :8080 --workers 1 --threads 8 app:app &\n\
cd /app && npm start &\n\
wait' > /app/start.sh && \
chmod +x /app/start.sh

# Ortam değişkenlerini ayarla
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1
ENV FLASK_APP=/app/api/app.py
ENV FLASK_ENV=production
ENV MONGO_URI="mongodb+srv://ae52:Erenemir1comehacker@cluster0.y5nv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV CLOUDINARY_CLOUD_NAME="dqhheif0c"
ENV CLOUDINARY_API_KEY="164851497378274"
ENV CLOUDINARY_API_SECRET="rKOL5XbXhqbheFG-xahvLsSthh4"

# Port 8080'i dinle
EXPOSE 8080

# Health check ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Uygulamayı başlat
CMD ["/app/start.sh"] 