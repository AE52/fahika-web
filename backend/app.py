from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime, timedelta
import cloudinary
import cloudinary.uploader
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'FA1907-gizli-anahtar')
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"]
    }
})

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

# Loglama yapılandırması
if not os.path.exists('logs'):
    os.makedirs('logs')
    
file_handler = RotatingFileHandler('logs/fahika.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Fahika backend başlatıldı')

# Cloudinary yapılandırması
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dqhheif0c'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '164851497378274'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'rKOL5XbXhqbheFG-xahvLsSthh4')
)

# MongoDB bağlantısı
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://ae52:Erenemir1comehacker@cluster0.y5nv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
try:
    client = MongoClient(MONGO_URI)
    db = client.fahika_db
    kokular_collection = db.kokular
    app.logger.info('MongoDB bağlantısı başarılı')
except Exception as e:
    app.logger.error(f'MongoDB bağlantı hatası: {str(e)}')
    raise

def koku_to_json(koku):
    try:
        koku['id'] = str(koku['_id'])
        del koku['_id']
        return koku
    except Exception as e:
        app.logger.error(f'Koku JSON dönüşüm hatası: {str(e)}')
        raise

@app.route('/api/kokular', methods=['GET'])
def get_kokular():
    try:
        kokular = list(kokular_collection.find())
        kokular_json = [koku_to_json(koku) for koku in kokular]
        app.logger.info(f'{len(kokular_json)} koku başarıyla getirildi')
        return jsonify({"kokular": kokular_json}), 200
    except Exception as e:
        app.logger.error(f'Kokuları getirme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/kokular/<id>', methods=['GET'])
def get_koku(id):
    try:
        koku = kokular_collection.find_one({"_id": ObjectId(id)})
        if koku:
            app.logger.info(f'Koku başarıyla getirildi: {id}')
            return jsonify(koku_to_json(koku)), 200
        app.logger.warning(f'Koku bulunamadı: {id}')
        return jsonify({"error": "Koku bulunamadı"}), 404
    except Exception as e:
        app.logger.error(f'Koku getirme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/kokular/<id>', methods=['PUT'])
def update_koku(id):
    try:
        guncelleme = request.json
        app.logger.info(f'Gelen güncelleme verisi: {guncelleme}')
        
        if '_id' in guncelleme:
            del guncelleme['_id']
        if 'id' in guncelleme:
            del guncelleme['id']
            
        # Mevcut kokuyu kontrol et
        mevcut_koku = kokular_collection.find_one({"_id": ObjectId(id)})
        if not mevcut_koku:
            app.logger.warning(f'Güncellenecek koku bulunamadı: {id}')
            return jsonify({"error": "Koku bulunamadı"}), 404
            
        # Güncelleme işlemi
        sonuc = kokular_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": guncelleme}
        )
        
        if sonuc.modified_count > 0:
            app.logger.info(f'Koku başarıyla güncellendi: {id}')
            guncel_koku = kokular_collection.find_one({"_id": ObjectId(id)})
            return jsonify(koku_to_json(guncel_koku)), 200
            
        app.logger.warning(f'Koku güncellenemedi: {id}')
        return jsonify({"error": "Koku güncellenemedi"}), 400
        
    except Exception as e:
        app.logger.error(f'Koku güncelleme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/kokular/<id>', methods=['DELETE'])
def delete_koku(id):
    try:
        # Önce kokuyu bul ve fotoğrafları Cloudinary'den sil
        koku = kokular_collection.find_one({"_id": ObjectId(id)})
        if koku and 'fotograflar' in koku:
            for foto in koku['fotograflar']:
                try:
                    public_id = foto['url'].split('/')[-1].split('.')[0]
                    cloudinary.uploader.destroy(public_id)
                except Exception as e:
                    app.logger.warning(f'Cloudinary fotoğraf silme hatası: {str(e)}')

        sonuc = kokular_collection.delete_one({"_id": ObjectId(id)})
        if sonuc.deleted_count > 0:
            app.logger.info(f'Koku başarıyla silindi: {id}')
            return jsonify({"message": "Koku silindi"}), 200
        app.logger.warning(f'Koku bulunamadı: {id}')
        return jsonify({"error": "Koku bulunamadı"}), 404
    except Exception as e:
        app.logger.error(f'Koku silme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/kokular', methods=['POST'])
def create_koku():
    try:
        yeni_koku = request.json
        yeni_koku['created_at'] = datetime.utcnow()
        
        sonuc = kokular_collection.insert_one(yeni_koku)
        yeni_koku['id'] = str(sonuc.inserted_id)
        del yeni_koku['_id']
        
        app.logger.info(f'Yeni koku oluşturuldu: {yeni_koku["id"]}')
        return jsonify(yeni_koku), 201
    except Exception as e:
        app.logger.error(f'Koku oluşturma hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        if 'file' not in request.files:
            app.logger.warning('Dosya yüklemesi başarısız: Dosya bulunamadı')
            return jsonify({"error": "Dosya bulunamadı"}), 400
            
        file = request.files['file']
        if file.filename == '':
            app.logger.warning('Dosya yüklemesi başarısız: Dosya seçilmedi')
            return jsonify({"error": "Dosya seçilmedi"}), 400
            
        if file:
            folder = request.form.get('folder', 'kokular')
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                resource_type="auto"
            )
            app.logger.info(f'Dosya başarıyla yüklendi: {result["public_id"]}')
            return jsonify({
                "url": result["secure_url"],
                "public_id": result["public_id"]
            }), 200
            
    except Exception as e:
        app.logger.error(f'Dosya yükleme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/kokular/<id>/fotograflar/sirala', methods=['PUT', 'OPTIONS'])
def sirala_fotograflar(id):
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        yeni_sira = request.json.get('fotograflar', [])
        
        sonuc = kokular_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"fotograflar": yeni_sira}}
        )
        
        if sonuc.modified_count > 0:
            app.logger.info(f'Fotoğraf sırası güncellendi: {id}')
            return jsonify({"message": "Fotoğraf sırası güncellendi"}), 200
        app.logger.warning(f'Fotoğraf sırası güncellenemedi: {id}')
        return jsonify({"error": "Fotoğraf sırası güncellenemedi"}), 400
    except Exception as e:
        app.logger.error(f'Fotoğraf sıralama hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/koku', methods=['GET'])
def get_all_kokular():
    try:
        # Sadece gerekli alanları getir
        projection = {
            "isim": 1,
            "slug": 1,
            "fiyat": 1,
            "ana_fotograf": 1,
            "kategori": 1,
            "hacim": 1
        }
        kokular = list(kokular_collection.find({}, projection))
        kokular_json = [koku_to_json(koku) for koku in kokular]
        app.logger.info(f'{len(kokular_json)} koku başarıyla getirildi (optimize edilmiş)')
        return jsonify({"kokular": kokular_json}), 200
    except Exception as e:
        app.logger.error(f'Kokuları getirme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/koku/<slug>', methods=['GET'])
def get_single_koku(slug):
    try:
        koku = kokular_collection.find_one({"slug": slug})
        if koku:
            app.logger.info(f'Koku başarıyla getirildi: {slug}')
            return jsonify(koku_to_json(koku)), 200
        app.logger.warning(f'Koku bulunamadı: {slug}')
        return jsonify({"error": "Koku bulunamadı"}), 404
    except Exception as e:
        app.logger.error(f'Koku getirme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token bulunamadı'}), 401
            
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Geçersiz token'}), 401
            
        return f(*args, **kwargs)
        
    return decorated

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        password = data.get('password')
        
        if password == 'FA1907':
            token = jwt.encode(
                {'exp': datetime.utcnow() + timedelta(hours=24)},
                app.config['SECRET_KEY'],
                algorithm="HS256"
            )
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Geçersiz şifre'}), 401
    except Exception as e:
        app.logger.error(f'Admin girişi hatası: {str(e)}')
        return jsonify({'message': 'Bir hata oluştu'}), 500

@app.route('/api/admin/kokular', methods=['GET'])
@admin_required
def get_admin_kokular():
    try:
        kokular = list(kokular_collection.find())
        kokular_json = [koku_to_json(koku) for koku in kokular]
        app.logger.info(f'{len(kokular_json)} koku başarıyla getirildi')
        return jsonify(kokular_json), 200
    except Exception as e:
        app.logger.error(f'Kokuları getirme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/kokular/<id>', methods=['PUT'])
@admin_required
def update_admin_koku(id):
    try:
        guncelleme = request.json
        app.logger.info(f'Gelen güncelleme verisi: {guncelleme}')
        
        if '_id' in guncelleme:
            del guncelleme['_id']
        if 'id' in guncelleme:
            del guncelleme['id']
            
        # Mevcut kokuyu kontrol et
        mevcut_koku = kokular_collection.find_one({"_id": ObjectId(id)})
        if not mevcut_koku:
            app.logger.warning(f'Güncellenecek koku bulunamadı: {id}')
            return jsonify({"error": "Koku bulunamadı"}), 404
            
        # Güncelleme işlemi
        sonuc = kokular_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": guncelleme}
        )
        
        if sonuc.modified_count > 0:
            app.logger.info(f'Koku başarıyla güncellendi: {id}')
            guncel_koku = kokular_collection.find_one({"_id": ObjectId(id)})
            return jsonify(koku_to_json(guncel_koku)), 200
            
        app.logger.warning(f'Koku güncellenemedi: {id}')
        return jsonify({"error": "Koku güncellenemedi"}), 400
        
    except Exception as e:
        app.logger.error(f'Koku güncelleme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/kokular/<id>', methods=['DELETE'])
@admin_required
def delete_admin_koku(id):
    try:
        # Önce kokuyu bul ve fotoğrafları Cloudinary'den sil
        koku = kokular_collection.find_one({"_id": ObjectId(id)})
        if koku and 'fotograflar' in koku:
            for foto in koku['fotograflar']:
                try:
                    public_id = foto['url'].split('/')[-1].split('.')[0]
                    cloudinary.uploader.destroy(public_id)
                except Exception as e:
                    app.logger.warning(f'Cloudinary fotoğraf silme hatası: {str(e)}')

        sonuc = kokular_collection.delete_one({"_id": ObjectId(id)})
        if sonuc.deleted_count > 0:
            app.logger.info(f'Koku başarıyla silindi: {id}')
            return jsonify({"message": "Koku silindi"}), 200
        app.logger.warning(f'Koku bulunamadı: {id}')
        return jsonify({"error": "Koku bulunamadı"}), 404
    except Exception as e:
        app.logger.error(f'Koku silme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/kokular', methods=['POST'])
@admin_required
def create_admin_koku():
    try:
        yeni_koku = request.json
        yeni_koku['created_at'] = datetime.utcnow()
        
        sonuc = kokular_collection.insert_one(yeni_koku)
        yeni_koku['id'] = str(sonuc.inserted_id)
        del yeni_koku['_id']
        
        app.logger.info(f'Yeni koku oluşturuldu: {yeni_koku["id"]}')
        return jsonify(yeni_koku), 201
    except Exception as e:
        app.logger.error(f'Koku oluşturma hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/upload', methods=['POST', 'OPTIONS'])
@admin_required
def admin_upload_file():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        if 'file' not in request.files:
            app.logger.warning('Dosya yüklemesi başarısız: Dosya bulunamadı')
            return jsonify({"error": "Dosya bulunamadı"}), 400
            
        file = request.files['file']
        if file.filename == '':
            app.logger.warning('Dosya yüklemesi başarısız: Dosya seçilmedi')
            return jsonify({"error": "Dosya seçilmedi"}), 400
            
        if file:
            folder = request.form.get('folder', 'kokular')
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                resource_type="auto"
            )
            app.logger.info(f'Dosya başarıyla yüklendi: {result["public_id"]}')
            return jsonify({
                "url": result["secure_url"],
                "public_id": result["public_id"]
            }), 200
            
    except Exception as e:
        app.logger.error(f'Dosya yükleme hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/kokular/<id>/fotograflar/sirala', methods=['PUT', 'OPTIONS'])
@admin_required
def admin_sirala_fotograflar(id):
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        yeni_sira = request.json.get('fotograflar', [])
        
        sonuc = kokular_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"fotograflar": yeni_sira}}
        )
        
        if sonuc.modified_count > 0:
            app.logger.info(f'Fotoğraf sırası güncellendi: {id}')
            return jsonify({"message": "Fotoğraf sırası güncellendi"}), 200
        app.logger.warning(f'Fotoğraf sırası güncellenemedi: {id}')
        return jsonify({"error": "Fotoğraf sırası güncellenemedi"}), 400
    except Exception as e:
        app.logger.error(f'Fotoğraf sıralama hatası: {str(e)}')
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080) 