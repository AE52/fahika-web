'use client';

import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';


interface Koku {
  id: string;
  slug: string;
  isim: string;
  ana_fotograf: string;
  fiyat: number;
  kategori: string;
  hacim: string;
}

export default function Header() {
  const router = useRouter();
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [aramaAcik, setAramaAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [sepetAcik, setSepetAcik] = useState(false);
  const [aramaSonuclari, setAramaSonuclari] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const aramaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aramaRef.current && !aramaRef.current.contains(event.target as Node)) {
        setAramaAcik(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const aramaYap = async () => {
      if (aramaMetni.length < 2) {
        setAramaSonuclari([]);
        return;
      }

      setYukleniyor(true);
      try {
        const response = await fetch(`http://localhost:5000/api/kokular`);
        if (!response.ok) throw new Error('Arama yapılırken bir hata oluştu');
        
        const kokular = await response.json();
        const filtrelenmisKokular = kokular.filter((koku: Koku) =>
          koku.isim.toLowerCase().includes(aramaMetni.toLowerCase()) ||
          koku.kategori.toLowerCase().includes(aramaMetni.toLowerCase())
        );
        
        setAramaSonuclari(filtrelenmisKokular);
      } catch (error) {
        console.error('Arama hatası:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    const timeoutId = setTimeout(aramaYap, 300);
    return () => clearTimeout(timeoutId);
  }, [aramaMetni]);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-gray-800">
            FAHİKA
          </Link>

          {/* Navigasyon */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Anasayfa
            </Link>
            <Link href="/hakkimizda" className="text-gray-600 hover:text-gray-900">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-gray-900">
              İletişim
            </Link>
          </nav>

          {/* Arama ve Sepet */}
          <div className="flex items-center space-x-4">
            {/* Arama */}
            <div className="relative" ref={aramaRef}>
              <button
                onClick={() => setAramaAcik(!aramaAcik)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {aramaAcik && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={aramaMetni}
                          onChange={(e) => setAramaMetni(e.target.value)}
                          placeholder="Koku ara..."
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                          autoFocus
                        />
                        <button
                          onClick={() => setAramaAcik(false)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes className="w-5 h-5" />
                        </button>
                      </div>

                      {yukleniyor ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                      ) : aramaSonuclari.length > 0 ? (
                        <div className="mt-4 space-y-2 max-h-96 overflow-auto">
                          {aramaSonuclari.map((koku) => (
                            <Link
                              key={koku.id}
                              href={`/kokularimiz/${koku.slug}`}
                              onClick={() => setAramaAcik(false)}
                              className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                <Image
                                  src={koku.ana_fotograf || '/placeholder.jpg'}
                                  alt={koku.isim}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-gray-900">{koku.isim}</h3>
                                <p className="text-sm text-gray-500">
                                  {koku.kategori === 'parfum' ? 'Parfüm' : 'Oda Kokusu'} • {koku.hacim}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{koku.fiyat} TL</span>
                            </Link>
                          ))}
                        </div>
                      ) : aramaMetni.length >= 2 ? (
                        <p className="text-center py-4 text-gray-500">Sonuç bulunamadı</p>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sepet */}
            <button
              onClick={() => setSepetAcik(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FaShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sepet Modal */}
      <AnimatePresence>
        {sepetAcik && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setSepetAcik(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 h-full w-96 max-w-full bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Sepetim</h2>
                  <button
                    onClick={() => setSepetAcik(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FaShoppingCart className="w-12 h-12 mb-4" />
                      <p className="text-lg">Sepetiniz boş</p>
                      <Link
                        href="/"
                        className="mt-4 text-sm text-black hover:underline"
                        onClick={() => setSepetAcik(false)}
                      >
                        Alışverişe Başla
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Image
                              src={item.ana_fotograf || '/placeholder.jpg'}
                              alt={item.isim}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium">{item.isim}</h3>
                            <p className="text-sm text-gray-500">
                              {item.kategori === 'parfum' ? 'Parfüm' : 'Oda Kokusu'} • {item.hacim}
                            </p>
                            <div className="flex items-center mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(0, item.miktar - 1))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                -
                              </button>
                              <span className="mx-2 min-w-[2rem] text-center">{item.miktar}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.miktar + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.fiyat * item.miktar} TL</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t p-4">
                    <Link
                      href="/sepet"
                      className="block w-full py-3 px-4 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => setSepetAcik(false)}
                    >
                      Sepete Git
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 