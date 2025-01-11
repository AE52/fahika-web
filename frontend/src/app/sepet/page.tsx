'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function SepetSayfasi() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const toplamTutar = cart.reduce((total, item) => total + item.fiyat * item.miktar, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-medium mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-500 mb-8">Sepetinizde henüz ürün bulunmuyor.</p>
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-medium mb-8">Sepetim ({cart.length} Ürün)</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Ürün Listesi */}
        <div className="lg:col-span-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                {/* Ürün Görseli */}
                <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={item.ana_fotograf}
                    alt={item.isim}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-grow">
                  <Link
                    href={`/${item.kategori}/${item.slug}`}
                    className="text-lg font-medium hover:text-gray-700 transition-colors"
                  >
                    {item.isim}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">{item.hacim}</p>
                </div>

                {/* Miktar Kontrolü */}
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.miktar - 1))}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Azalt"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.miktar}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.miktar + 1)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Artır"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Fiyat ve Silme */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="font-medium">
                    {(item.fiyat * item.miktar).toLocaleString('tr-TR')} ₺
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Sil"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{toplamTutar.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span>Ücretsiz</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-medium text-lg">
                  <span>Toplam</span>
                  <span>{toplamTutar.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-900 transition-colors">
              Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 