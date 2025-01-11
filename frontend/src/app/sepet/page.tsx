'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function SepetSayfasi() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-3xl font-light mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Henüz sepetinize ürün eklemediniz.</p>
          <Link
            href="/"
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Ürün Listesi */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-6 p-4 bg-white rounded-lg shadow-sm"
            >
              <Link href={`/kokularimiz/${item.slug}`} className="shrink-0">
                <div className="relative w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.ana_fotograf}
                    alt={item.isim}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex-grow">
                <Link href={`/kokularimiz/${item.slug}`}>
                  <h3 className="text-lg font-light hover:text-gray-600 transition-colors">
                    {item.isim}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-4">
                  {item.kategori === 'parfum' ? 'Parfüm' : 'Oda Kokusu'} • {item.hacim}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.miktar - 1))}
                        className="px-3 py-1 text-gray-600 hover:text-black transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.miktar}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.miktar + 1)}
                        className="px-3 py-1 text-gray-600 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <span className="text-lg">{item.fiyat * item.miktar} TL</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium">Sipariş Özeti</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Toplam</span>
                <span className="font-medium">{totalPrice} TL</span>
              </div>
            </div>

            <Link
              href={`https://wa.me/905555555555?text=${encodeURIComponent(
                `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${cart
                  .map(
                    (item) =>
                      `${item.isim} (${item.hacim}) - ${item.miktar} adet - ${
                        item.fiyat * item.miktar
                      } TL`
                  )
                  .join('\n')}\n\nToplam Tutar: ${totalPrice} TL`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition-colors"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp ile Sipariş Ver
            </Link>

            <p className="text-sm text-gray-500 text-center">
              WhatsApp üzerinden siparişinizi iletebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 