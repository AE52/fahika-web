from typing import Dict, List, Optional, Any
from bson import ObjectId
from config import db

class MongoHelper:
    @staticmethod
    def object_id_to_str(obj: Dict) -> Dict:
        """ObjectId'yi string'e çevirir"""
        if obj.get('_id'):
            obj['_id'] = str(obj['_id'])
        return obj

    @staticmethod
    def str_to_object_id(id_str: str) -> ObjectId:
        """String'i ObjectId'ye çevirir"""
        try:
            return ObjectId(id_str)
        except:
            return None

    @staticmethod
    def find_one(collection: str, query: Dict) -> Optional[Dict]:
        """Tek bir döküman bulur"""
        result = getattr(db, collection).find_one(query)
        if result:
            return MongoHelper.object_id_to_str(result)
        return None

    @staticmethod
    def find_many(collection: str, query: Dict = None, 
                 sort: List = None, limit: int = 0, skip: int = 0) -> List[Dict]:
        """Birden fazla döküman bulur"""
        cursor = getattr(db, collection).find(query or {})
        
        if sort:
            cursor = cursor.sort(sort)
        if skip:
            cursor = cursor.skip(skip)
        if limit:
            cursor = cursor.limit(limit)
            
        return [MongoHelper.object_id_to_str(doc) for doc in cursor]

    @staticmethod
    def insert_one(collection: str, document: Dict) -> Optional[str]:
        """Tek bir döküman ekler"""
        result = getattr(db, collection).insert_one(document)
        return str(result.inserted_id) if result.inserted_id else None

    @staticmethod
    def insert_many(collection: str, documents: List[Dict]) -> List[str]:
        """Birden fazla döküman ekler"""
        result = getattr(db, collection).insert_many(documents)
        return [str(id) for id in result.inserted_ids]

    @staticmethod
    def update_one(collection: str, query: Dict, update: Dict) -> bool:
        """Tek bir dökümanı günceller"""
        result = getattr(db, collection).update_one(query, {'$set': update})
        return result.modified_count > 0

    @staticmethod
    def update_many(collection: str, query: Dict, update: Dict) -> int:
        """Birden fazla dökümanı günceller"""
        result = getattr(db, collection).update_many(query, {'$set': update})
        return result.modified_count

    @staticmethod
    def delete_one(collection: str, query: Dict) -> bool:
        """Tek bir dökümanı siler"""
        result = getattr(db, collection).delete_one(query)
        return result.deleted_count > 0

    @staticmethod
    def delete_many(collection: str, query: Dict) -> int:
        """Birden fazla dökümanı siler"""
        result = getattr(db, collection).delete_many(query)
        return result.deleted_count

    @staticmethod
    def count_documents(collection: str, query: Dict = None) -> int:
        """Döküman sayısını döndürür"""
        return getattr(db, collection).count_documents(query or {})

    @staticmethod
    def aggregate(collection: str, pipeline: List[Dict]) -> List[Dict]:
        """Aggregation pipeline çalıştırır"""
        cursor = getattr(db, collection).aggregate(pipeline)
        return [MongoHelper.object_id_to_str(doc) for doc in cursor] 