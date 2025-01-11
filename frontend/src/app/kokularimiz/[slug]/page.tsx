"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error('Ürün yüklenirken bir hata oluştu');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Ürün getirme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: 1
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 md:h-[600px]">
          <Image
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {product.price} TL
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Sepete Ekle
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Ürün Detayları</h2>
            <div className="space-y-2">
              <p className="flex justify-between border-b pb-2">
                <span className="font-medium">Kategori:</span>
                <span>{product.category}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 