from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader
import os
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB bağlantısı
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://ae52:Erenemir1comehacker@cluster0.y5nv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
client = MongoClient(MONGO_URI)
db = client.fahika_db

# Cloudinary yapılandırması
cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', 'dqhheif0c'),
    api_key = os.getenv('CLOUDINARY_API_KEY', '164851497378274'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET', 'rKOL5XbXhqbheFG-xahvLsSthh4')
)

def koku_to_dict(koku):
    return {
        'id': str(koku['_id']),
        'isim': koku.get('isim', ''),
        'slug': koku.get('slug', ''),
        'fotograflar': koku.get('fotograflar', []),
        'ana_fotograf': koku.get('ana_fotograf', ''),
        'fiyat': koku.get('fiyat', 0),
        'aciklama': koku.get('aciklama', ''),
        'kategori': koku.get('kategori', ''),
        'stok': koku.get('stok', 0),
        'koku_notlari': koku.get('koku_notlari', ''),
        'hacim': koku.get('hacim', ''),
        'created_at': koku.get('created_at', datetime.now())
    }

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/kokular', methods=['GET'])
def get_kokular():
    try:
        kokular = list(db.kokular.find().sort('created_at', -1))
        return jsonify([koku_to_dict(koku) for koku in kokular]), 200
    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/slug/<slug>', methods=['GET'])
def get_koku_by_slug(slug):
    try:
        koku = db.kokular.find_one({'slug': slug})
        if koku:
            return jsonify(koku_to_dict(koku)), 200
        return jsonify({'error': 'Koku bulunamadı'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular', methods=['POST'])
def create_koku():
    try:
        koku = request.json
        koku['created_at'] = datetime.now()
        result = db.kokular.insert_one(koku)
        koku['_id'] = result.inserted_id
        return jsonify(koku_to_dict(koku)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/<id>', methods=['PUT'])
def update_koku(id):
    try:
        koku = request.json
        koku['updated_at'] = datetime.now()
        db.kokular.update_one({'_id': ObjectId(id)}, {'$set': koku})
        return jsonify({'message': 'Koku güncellendi'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/<id>', methods=['DELETE'])
def delete_koku(id):
    try:
        result = db.kokular.delete_one({'_id': ObjectId(id)})
        if result.deleted_count:
            return jsonify({'message': 'Koku silindi'}), 200
        return jsonify({'error': 'Koku bulunamadı'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port) 