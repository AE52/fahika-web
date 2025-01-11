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

// Loading komponenti
function ImageLoadingSkeleton() {
  return (
    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
    </div>
  );
}

// Image wrapper komponenti
function ImageWithLoading({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && <ImageLoadingSkeleton />}
      <Image
        src={src}
        alt={alt}
        {...props}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}

async function getKokuData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/detay/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Koku getirilemedi: ${response.status}`);
    }

    const data = await response.json();

    // Veri kontrolü
    if (!data || typeof data !== 'object') {
      throw new Error('API yanıtı geçerli bir format değil');
    }

    // Zorunlu alanların kontrolü
    const requiredFields = ['id', 'isim', 'slug', 'fiyat', 'kategori'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Eksik veri alanı: ${field}`);
      }
    }

    // Fotoğraf URL'lerinin kontrolü ve düzenlenmesi
    let fotograflar = Array.isArray(data.fotograflar) ? data.fotograflar : [];
    fotograflar = fotograflar
      .filter((foto: Fotograf) => foto && typeof foto.url === 'string' && foto.url.trim() !== '')
      .map((foto: Fotograf, index: number) => ({
        url: foto.url,
        sira: foto.sira || index
      }))
      .sort((a: Fotograf, b: Fotograf) => a.sira - b.sira);

    // Ana fotoğraf kontrolü
    if (data.ana_fotograf && typeof data.ana_fotograf === 'string' && data.ana_fotograf.trim() !== '') {
      const anaFotoIndex = fotograflar.findIndex((f: Fotograf) => f.url === data.ana_fotograf);
      if (anaFotoIndex === -1) {
        fotograflar.unshift({ url: data.ana_fotograf, sira: -1 });
      } else if (anaFotoIndex !== 0) {
        const [anaFoto] = fotograflar.splice(anaFotoIndex, 1);
        fotograflar.unshift(anaFoto);
      }
    } else if (fotograflar.length > 0) {
      data.ana_fotograf = fotograflar[0].url;
    }

    return {
      ...data,
      fotograflar,
      ana_fotograf: data.ana_fotograf || (fotograflar[0]?.url || '')
    };
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    throw error;
  }
}

function UrunDetayContent({ params }: { params: { kategori: string; slug: string } }) {
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
        const data = await getKokuData(params.slug);
        setKoku(data);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        setHata(error instanceof Error ? error.message : 'Koku yüklenirken bir hata oluştu');
        toast.error('Koku yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    }

    kokuGetir();
  }, [params.slug]);

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

  const sepeteEkle = () => {
    if (!koku) return;
    
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Taraf - Fotoğraf Galerisi */}
        <div className="space-y-4">
          {/* Ana Slider */}
          <div className="aspect-[3/4] relative bg-gray-50 rounded-lg overflow-hidden">
            <Swiper
              spaceBetween={0}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[Navigation, Thumbs]}
              className="h-full"
            >
              {koku.fotograflar.map((foto, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <ImageWithLoading
                      src={foto.url}
                      alt={`${koku.isim} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Slider */}
          {koku.fotograflar.length > 1 && (
            <div className="relative">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
              >
                {koku.fotograflar.map((foto, index) => (
                  <SwiperSlide key={index} style={{ width: '5rem', height: '6.5rem' }}>
                    <div className="relative w-full h-full cursor-pointer rounded-md overflow-hidden">
                      <ImageWithLoading
                        src={foto.url}
                        alt={`${koku.isim} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-75 transition-opacity"
                        sizes="80px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <div>
            <h1 className="text-3xl font-light mb-2">{koku.isim}</h1>
            <p className="text-2xl">{koku.fiyat.toLocaleString('tr-TR')} ₺</p>
            <p className="text-sm text-gray-500 mt-1">{koku.hacim}</p>
          </div>

          {koku.koku_notlari && (
            <div>
              <h2 className="text-lg font-medium mb-2">Koku Notları</h2>
              <p className="text-gray-600">{koku.koku_notlari}</p>
            </div>
          )}

          {koku.aciklama && (
            <div>
              <h2 className="text-lg font-medium mb-2">Açıklama</h2>
              <p className="text-gray-600 whitespace-pre-line">{koku.aciklama}</p>
            </div>
          )}

          <div className="pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
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
              className={`w-full py-4 rounded-lg text-white transition-colors ${
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
  );
}

export default function UrunDetay({ params }: { params: Promise<{ kategori: string; slug: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="bg-white">
      <UrunDetayContent params={resolvedParams} />
    </div>
  );
} 