'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface Koku {
  id: string;
  slug: string;
  isim: string;
  ana_fotograf: string;
  fotograflar: string[];
  fiyat: number;
  kategori: string;
  hacim: string;
  aciklama: string;
  stok: number;
  koku_notlari: string;
  created_at: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const kokulariGetir = async () => {
      try {
        setYukleniyor(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular`);
        if (!response.ok) {
          throw new Error('Kokular getirilemedi');
        }
        const data = await response.json();
        if (!data.kokular) {
          throw new Error('Kokular bulunamadı');
        }

        // Arama sorgusuna göre kokuları filtrele
        const filtrelenmisKokular = data.kokular.filter((koku: Koku) => {
          const searchQuery = query?.toLowerCase() || '';
          return (
            koku.isim.toLowerCase().includes(searchQuery) ||
            koku.kategori.toLowerCase().includes(searchQuery) ||
            koku.aciklama.toLowerCase().includes(searchQuery) ||
            koku.koku_notlari.toLowerCase().includes(searchQuery)
          );
        });

        setKokular(filtrelenmisKokular);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Kokular yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    };

    if (query) {
      kokulariGetir();
    }
  }, [query]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-medium mb-8">
        {query ? `"${query}" için arama sonuçları` : 'Tüm Ürünler'}
        <span className="text-gray-500 text-lg ml-2">({kokular.length} ürün)</span>
      </h1>

      {kokular.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Arama sonucu bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {kokular.map((koku) => (
            <ProductCard
              key={koku.id}
              koku={koku}
              onSepeteEkle={sepeteEkle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
} 