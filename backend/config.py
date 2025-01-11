import os
from dotenv import load_dotenv
import cloudinary
from pymongo import MongoClient

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantısı
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/fahika')
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.get_default_database()

# Cloudinary yapılandırması
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Uygulama yapılandırması
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'gizli-anahtar-buraya')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max dosya boyutu

# MongoDB koleksiyonları
urunler = db.urunler
kategoriler = db.kategoriler
siparisler = db.siparisler
kullanicilar = db.kullanicilar 