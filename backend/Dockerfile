# Python base image'ı
FROM python:3.9-slim as builder

# Çalışma dizinini ayarla
WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıklarını kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Çalışma zamanı yapılandırması
ENV PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0

# Health check tanımla
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Port ayarı
EXPOSE ${PORT}

# Uygulamayı başlat
CMD exec gunicorn --bind :${PORT} --workers 4 --threads 8 --timeout 0 app:app 