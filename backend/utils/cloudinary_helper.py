import cloudinary
import cloudinary.uploader
from typing import List, Dict, Union
import os

def upload_image(file_path: str, folder: str = "urunler") -> Dict[str, str]:
    """
    Cloudinary'ye resim yükler
    
    Args:
        file_path: Yüklenecek dosyanın yolu
        folder: Cloudinary'deki klasör adı
        
    Returns:
        Dict: Yüklenen resmin bilgileri
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            overwrite=True,
            resource_type="auto"
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"]
        }
    except Exception as e:
        print(f"Resim yükleme hatası: {str(e)}")
        return None

def delete_image(public_id: str) -> bool:
    """
    Cloudinary'den resim siler
    
    Args:
        public_id: Silinecek resmin public_id'si
        
    Returns:
        bool: Silme işlemi başarılı ise True
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        print(f"Resim silme hatası: {str(e)}")
        return False

def upload_multiple_images(file_paths: List[str], folder: str = "urunler") -> List[Dict[str, str]]:
    """
    Birden fazla resmi Cloudinary'ye yükler
    
    Args:
        file_paths: Yüklenecek dosyaların yolları
        folder: Cloudinary'deki klasör adı
        
    Returns:
        List[Dict]: Yüklenen resimlerin bilgileri
    """
    results = []
    for file_path in file_paths:
        result = upload_image(file_path, folder)
        if result:
            results.append(result)
    return results

def update_image(old_public_id: str, new_file_path: str, folder: str = "urunler") -> Dict[str, str]:
    """
    Var olan resmi günceller
    
    Args:
        old_public_id: Güncellenecek resmin public_id'si
        new_file_path: Yeni resmin dosya yolu
        folder: Cloudinary'deki klasör adı
        
    Returns:
        Dict: Güncellenen resmin bilgileri
    """
    # Eski resmi sil
    delete_image(old_public_id)
    
    # Yeni resmi yükle
    return upload_image(new_file_path, folder) 