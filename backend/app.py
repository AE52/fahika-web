from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from config import Config
from utils.mongo_helper import MongoHelper
from utils.cloudinary_helper import upload_image, delete_image, upload_multiple_images

app = Flask(__name__)
CORS(app)

# Yapılandırmayı yükle
app.config.from_object(Config)

# Health check endpoint'i
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

# Ana endpoint
@app.route('/')
def home():
    return jsonify({"message": "Fahika API'ye Hoş Geldiniz"}), 200

# Ürünler endpoint'i
@app.route('/api/urunler', methods=['GET'])
def get_urunler():
    try:
        urunler = MongoHelper.find_many('urunler')
        return jsonify({"urunler": urunler}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/urunler', methods=['POST'])
def create_urun():
    try:
        data = request.json
        urun_id = MongoHelper.insert_one('urunler', data)
        return jsonify({"id": urun_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/urunler/<id>', methods=['GET'])
def get_urun(id):
    try:
        urun = MongoHelper.find_one('urunler', {"_id": MongoHelper.str_to_object_id(id)})
        if urun:
            return jsonify(urun), 200
        return jsonify({"error": "Ürün bulunamadı"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/urunler/<id>', methods=['PUT'])
def update_urun(id):
    try:
        data = request.json
        success = MongoHelper.update_one('urunler', 
                                       {"_id": MongoHelper.str_to_object_id(id)}, 
                                       data)
        if success:
            return jsonify({"message": "Ürün güncellendi"}), 200
        return jsonify({"error": "Ürün bulunamadı"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/urunler/<id>', methods=['DELETE'])
def delete_urun(id):
    try:
        success = MongoHelper.delete_one('urunler', 
                                       {"_id": MongoHelper.str_to_object_id(id)})
        if success:
            return jsonify({"message": "Ürün silindi"}), 200
        return jsonify({"error": "Ürün bulunamadı"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Resim yükleme endpoint'i
@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Dosya bulunamadı"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Dosya seçilmedi"}), 400
            
        if file:
            folder = request.form.get('folder', 'urunler')
            result = upload_image(file, folder)
            if result:
                return jsonify(result), 200
            return jsonify({"error": "Yükleme başarısız"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port) 