#!/bin/bash

# Flask API'yi başlat
cd /app/api
gunicorn --bind :8080 --workers 1 --threads 8 app:app &

# Next.js uygulamasını başlat
cd /app
npm start &

# Her iki process'i de bekle
wait 