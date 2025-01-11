import os
from dotenv import load_dotenv
import cloudinary
from pymongo import MongoClient

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantısı
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://ae52:Erenemir1comehacker@cluster0.y5nv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'fahika')

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client[DATABASE_NAME]
    # Test connection
    mongo_client.server_info()
    print(f"MongoDB bağlantısı başarılı: {DATABASE_NAME}")
except Exception as e:
    print(f"MongoDB bağlantı hatası: {str(e)}")
    raise

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
kokular = db.kokular
kategoriler = db.kategoriler
siparisler = db.siparisler
kullanicilar = db.kullanicilar 