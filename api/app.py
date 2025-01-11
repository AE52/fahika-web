from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import timedelta, datetime
import cloudinary
import cloudinary.uploader

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gizli-anahtar-123'
    MONGO_URI = "mongodb+srv://ae52:Erenemir1comehacker@cluster0.y5nv8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    MONGO_DB = 'fahika_db'
    JWT_EXPIRATION = timedelta(days=7)
    CLOUDINARY_CLOUD_NAME = 'dqhheif0c'
    CLOUDINARY_API_KEY = '164851497378274'
    CLOUDINARY_API_SECRET = 'rKOL5XbXhqbheFG-xahvLsSthh4'

app = Flask(__name__)
CORS(app)

# MongoDB bağlantısı
client = MongoClient(Config.MONGO_URI)
db = client[Config.MONGO_DB]
kokular_collection = db.kokular

# Cloudinary konfigürasyonu
cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET
)

def koku_to_dict(koku):
    koku['id'] = str(koku['_id'])
    del koku['_id']
    return koku

@app.route('/api/kokular', methods=['GET'])
def get_kokular():
    try:
        kokular = list(kokular_collection.find().sort('created_at', -1))
        return jsonify([koku_to_dict(koku) for koku in kokular])
    except Exception as e:
        print('Hata:', str(e))  # Hata detayını konsola yazdır
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/<id>', methods=['GET'])
def get_koku(id):
    try:
        koku = kokular_collection.find_one({'_id': ObjectId(id)})
        if koku is None:
            return jsonify({'error': 'Koku bulunamadı'}), 404
        return jsonify(koku_to_dict(koku))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular', methods=['POST'])
def create_koku():
    try:
        data = request.json
        data['created_at'] = datetime.utcnow()
        result = kokular_collection.insert_one(data)
        koku = kokular_collection.find_one({'_id': result.inserted_id})
        return jsonify(koku_to_dict(koku)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/<id>', methods=['PUT'])
def update_koku(id):
    try:
        data = request.json
        data['updated_at'] = datetime.utcnow()
        result = kokular_collection.update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'Koku bulunamadı'}), 404
        koku = kokular_collection.find_one({'_id': ObjectId(id)})
        return jsonify(koku_to_dict(koku))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/<id>', methods=['DELETE'])
def delete_koku(id):
    try:
        result = kokular_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Koku bulunamadı'}), 404
        return jsonify({'message': 'Koku başarıyla silindi'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/kokular/slug/<slug>', methods=['GET'])
def get_koku_by_slug(slug):
    try:
        koku = kokular_collection.find_one({'slug': slug})
        if koku is None:
            return jsonify({'error': 'Koku bulunamadı'}), 404
        return jsonify(koku_to_dict(koku))
    except Exception as e:
        print('Hata:', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 