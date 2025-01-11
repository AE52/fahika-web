# Backend için Dockerfile
FROM python:3.9-slim as builder

WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıklarını kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production aşaması
FROM python:3.9-slim

WORKDIR /app

# Gerekli sistem paketlerini yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Python paketlerini kopyala
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Uygulama kodunu kopyala
COPY . .

# Production ortam değişkenleri
ENV FLASK_APP=app.py \
    FLASK_ENV=production \
    PORT=8080 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    GUNICORN_CMD_ARGS="--workers=1 --threads=8 --timeout=0"

# Port 8080'i dinle
EXPOSE 8080

# Health check ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/health || exit 1

# Uygulamayı başlat
CMD exec gunicorn --bind :$PORT app:app 