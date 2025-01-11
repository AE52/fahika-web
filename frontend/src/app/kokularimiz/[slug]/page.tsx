"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { use } from 'react';
import { useCart } from '@/context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface Fotograf {
  url: string;
  sira: number;
}

interface Koku {
  id: string;
  isim: string;
  slug: string;
  fotograflar: Fotograf[];
  ana_fotograf: string;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

function UrunDetayContent({ slug }: { slug: string }) {
  const [koku, setKoku] = useState<Koku | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function kokuGetir() {
      try {
        setYukleniyor(true);
        setHata(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular`);
        
        if (!response.ok) {
          throw new Error('Koku getirilemedi');
        }

        const data = await response.json();
        const bulunanKoku = data.kokular.find((k: Koku) => k.slug === slug);
        
        if (!bulunanKoku) {
          throw new Error('Koku bulunamadı');
        }

        // Fotoğrafları sırala
        if (Array.isArray(bulunanKoku.fotograflar)) {
          bulunanKoku.fotograflar.sort((a: Fotograf, b: Fotograf) => a.sira - b.sira);
        }

        setKoku(bulunanKoku);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        setHata(error instanceof Error ? error.message : 'Koku yüklenirken bir hata oluştu');
        toast.error('Koku yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    }

    kokuGetir();
  }, [slug]);

  const sepeteEkle = () => {
    if (!koku) return;
    
    addToCart({
      id: koku.id,
      slug: koku.slug,
      isim: koku.isim,
      ana_fotograf: koku.ana_fotograf || koku.fotograflar[0]?.url,
      fiyat: koku.fiyat,
      kategori: koku.kategori,
      hacim: koku.hacim
    });
    toast.success('Ürün sepete eklendi', { duration: 2000 });
  };

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (hata) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{hata}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!koku) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Koku bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sol Taraf - Fotoğraf Galerisi */}
        <div className="space-y-6">
          {/* Ana Slider */}
          <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
            <Swiper
              spaceBetween={0}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Navigation, Thumbs]}
              className="h-full product-main-slider"
            >
              {koku.fotograflar.map((foto, index) => (
                <SwiperSlide key={index}>
                  {foto.url && (
                    <Image
                      src={foto.url}
                      alt={`${koku.isim} - ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Slider */}
          {koku.fotograflar.length > 1 && (
            <div className="relative">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="product-thumbs-slider"
              >
                {koku.fotograflar.map((foto, index) => (
                  <SwiperSlide key={index} style={{ width: '6rem', height: '6rem' }}>
                    {foto.url && (
                      <div className="relative w-full h-full cursor-pointer rounded-md overflow-hidden">
                        <Image
                          src={foto.url}
                          alt={`${koku.isim} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover hover:opacity-75 transition-opacity"
                          sizes="96px"
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="lg:sticky lg:top-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-light mb-2">{koku.isim}</h1>
              <p className="text-3xl font-light">{koku.fiyat.toLocaleString('tr-TR')} ₺</p>
              <p className="text-sm text-gray-500 mt-2">{koku.hacim}</p>
            </div>

            {koku.koku_notlari && (
              <div>
                <h2 className="text-lg font-medium mb-3">Koku Notları</h2>
                <p className="text-gray-600 leading-relaxed">{koku.koku_notlari}</p>
              </div>
            )}

            {koku.aciklama && (
              <div>
                <h2 className="text-lg font-medium mb-3">Açıklama</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{koku.aciklama}</p>
              </div>
            )}

            <div className="pt-8 border-t">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium">Stok Durumu</span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  koku.stok > 5 ? 'bg-green-100 text-green-800' : 
                  koku.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {koku.stok > 0 ? `${koku.stok} adet` : 'Stokta yok'}
                </span>
              </div>

              <button
                onClick={sepeteEkle}
                disabled={koku.stok === 0}
                className={`w-full py-4 text-lg rounded-lg text-white transition-colors ${
                  koku.stok === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-900'
                }`}
              >
                {koku.stok === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UrunDetay({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  return <UrunDetayContent slug={resolvedParams.slug} />;
} 