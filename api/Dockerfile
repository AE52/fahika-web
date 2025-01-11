# Backend için Cloud Run Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıklarını kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Ortam değişkenlerini ayarla
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=8080

# Port 8080'i dinle (Cloud Run standardı)
EXPOSE 8080

# Healthcheck ekle
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Gunicorn ile uygulamayı başlat
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app:app 