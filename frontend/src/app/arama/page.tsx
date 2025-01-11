'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

interface Fotograf {
  url: string;
  sira: number;
}

interface Koku {
  id: number;
  slug: string;
  isim: string;
  fotograflar: Fotograf[];
  ana_fotograf: string | null;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

export default function AramaSayfasi() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const aramaMetni = searchParams.get('q');
    if (aramaMetni) {
      kokulariAra(aramaMetni);
    }
  }, [searchParams]);

  const kokulariAra = async (aramaMetni: string) => {
    try {
      setYukleniyor(true);
      const { data, error } = await supabase
        .from('kokular')
        .select('*')
        .or(`isim.ilike.%${aramaMetni}%,aciklama.ilike.%${aramaMetni}%,koku_notlari.ilike.%${aramaMetni}%`);

      if (error) throw error;
      setKokular(data || []);
    } catch (error) {
      console.error('Arama hatası:', error);
      toast.error('Arama yapılırken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  const sepeteEkle = (koku: Koku) => {
    addToCart({
      id: koku.id,
      slug: koku.slug,
      isim: koku.isim,
      ana_fotograf: koku.ana_fotograf,
      fiyat: koku.fiyat,
      kategori: koku.kategori,
      hacim: koku.hacim,
      miktar: 1
    });
    toast.success('Ürün sepete eklendi');
  };

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Arama Sonuçları: "{searchParams.get('q')}"
      </h1>

      {kokular.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aramanızla eşleşen sonuç bulunamadı.</p>
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 font-medium"
          >
            Tüm Kokuları Görüntüle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kokular.map((koku) => (
            <div
              key={koku.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={koku.ana_fotograf || '/placeholder.jpg'}
                  alt={koku.isim}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{koku.isim}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{koku.aciklama}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">{koku.fiyat} TL</span>
                  <span className="text-sm text-gray-500">{koku.hacim} ml</span>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/kokularimiz/${koku.slug}`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Detaylar
                  </Link>
                  <button
                    onClick={() => sepeteEkle(koku)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center gap-2"
                  >
                    <FaShoppingCart size={16} />
                    Sepete Ekle
                  </button>
                </div>
                <div className="mt-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {koku.kategori === 'parfum' ? 'Parfüm' : 'Oda Kokusu'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 