# Frontend için build aşaması
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# ESLint kontrolünü devre dışı bırakarak build et
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_LINT_DURING_BUILD=false
RUN npm run build

# Backend için build aşaması
FROM python:3.9-slim AS backend-builder

WORKDIR /app/backend

# Python bağımlılıkları için requirements.txt oluştur
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# API kaynak kodlarını kopyala
COPY api/ .

# Production aşaması
FROM node:18-alpine

WORKDIR /app

# Python yükle
RUN apk add --no-cache python3

# Frontend build dosyalarını kopyala
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules

# Backend dosyalarını kopyala
COPY --from=backend-builder /app/backend /app/api
COPY --from=backend-builder /usr/local/lib/python3.9 /usr/local/lib/python3.9
COPY --from=backend-builder /usr/local/bin/python /usr/local/bin/python

# Gerekli ortam değişkenlerini ayarla
ENV NODE_ENV=production
ENV PORT=3000
ENV FLASK_APP=/app/api/app.py
ENV FLASK_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Başlatma scriptini oluştur
RUN echo '#!/bin/sh\n\
cd /app/api && python3 app.py &\n\
cd /app && npm start' > /app/start.sh && \
chmod +x /app/start.sh

EXPOSE 3000 5000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["/app/start.sh"] 