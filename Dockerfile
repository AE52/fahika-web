# Frontend build aşaması
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Frontend bağımlılıklarını kopyala ve yükle
COPY package*.json ./
RUN npm install

# Frontend kaynak kodlarını kopyala
COPY . .

# ESLint kontrolünü devre dışı bırakarak build et
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_LINT_DURING_BUILD=false
RUN npm run build

# Backend build aşaması
FROM python:3.9-slim AS backend-builder

WORKDIR /app/backend

# Python bağımlılıklarını yükle
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# API kaynak kodlarını kopyala
COPY api/ .

# Production aşaması
FROM python:3.9-slim

WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Frontend dosyalarını kopyala
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/frontend/next.config.js ./

# Frontend bağımlılıklarını production modunda yükle
RUN npm install --production

# Backend dosyalarını kopyala
COPY --from=backend-builder /app/backend /app/api
COPY --from=backend-builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Başlatma scriptini oluştur
RUN echo '#!/bin/bash\n\
cd /app/api && gunicorn --bind :8080 --workers 1 --threads 8 app:app &\n\
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

# Port 8080'i dinle (Cloud Run standardı)
EXPOSE 8080

# Healthcheck ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Uygulamayı başlat
CMD ["/app/start.sh"] 