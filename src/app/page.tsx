'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Koku {
  id: string;
  slug: string;
  isim: string;
  ana_fotograf: string;
  fotograflar: { url: string; sira: number }[];
  fiyat: number;
  kategori: string;
  hacim: string;
  stok: number;
}

export default function Home() {
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [seciliKategori, setSeciliKategori] = useState<string>('tumu');
  const [siralama, setSiralama] = useState<string>('varsayilan');
  const { addToCart } = useCart();

  useEffect(() => {
    const kokulariGetir = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kokular');
        if (!response.ok) throw new Error('Kokular getirilemedi');
        const data = await response.json();
        setKokular(data);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Kokular yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    };

    kokulariGetir();
  }, []);

  const filtrelenmisKokular = kokular
    .filter(koku => seciliKategori === 'tumu' || koku.kategori === seciliKategori)
    .sort((a, b) => {
      switch (siralama) {
        case 'fiyat-artan':
          return a.fiyat - b.fiyat;
        case 'fiyat-azalan':
          return b.fiyat - a.fiyat;
        case 'isim-a-z':
          return a.isim.localeCompare(b.isim);
        case 'isim-z-a':
          return b.isim.localeCompare(a.isim);
        default:
          return 0;
      }
    });

  const sepeteEkle = (koku: Koku) => {
    addToCart({
      id: koku.id,
      slug: koku.slug,
      isim: koku.isim,
      ana_fotograf: koku.ana_fotograf,
      fiyat: koku.fiyat,
      kategori: koku.kategori,
      hacim: koku.hacim
    });
    toast.success('Ürün sepete eklendi');
  };

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSeciliKategori('tumu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              seciliKategori === 'tumu'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setSeciliKategori('parfum')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              seciliKategori === 'parfum'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Parfümler
          </button>
          <button
            onClick={() => setSeciliKategori('oda-kokusu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              seciliKategori === 'oda-kokusu'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Oda Kokuları
          </button>
        </div>

        <select
          value={siralama}
          onChange={(e) => setSiralama(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="varsayilan">Varsayılan Sıralama</option>
          <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
          <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
          <option value="isim-a-z">İsim: A-Z</option>
          <option value="isim-z-a">İsim: Z-A</option>
        </select>
      </div>

      {/* Ürün Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtrelenmisKokular.map((koku) => (
          <motion.div
            key={koku.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <Link href={`/kokularimiz/${koku.slug}`} className="block">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={koku.ana_fotograf}
                  alt={koku.isim}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {koku.fotograflar.length > 1 && (
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={koku.fotograflar[1].url}
                      alt={`${koku.isim} - 2`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                {koku.stok === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium px-4 py-2 bg-black rounded-full">
                      Tükendi
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <div className="space-y-2">
              <Link href={`/kokularimiz/${koku.slug}`} className="block">
                <h3 className="text-lg font-light hover:text-gray-600 transition-colors">
                  {koku.isim}
                </h3>
              </Link>
              <div className="flex items-baseline justify-between">
                <span className="text-lg">{koku.fiyat} TL</span>
                <span className="text-sm text-gray-500">{koku.hacim}</span>
              </div>
              <button
                onClick={() => sepeteEkle(koku)}
                disabled={koku.stok === 0}
                className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                  koku.stok > 0
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {koku.stok > 0 ? 'Sepete Ekle' : 'Tükendi'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
