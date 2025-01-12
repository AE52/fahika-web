"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
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

interface PageProps {
  params: {
    slug: string;
  };
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
        quality={100}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}

async function getKokuData(slug: string) {
  try {
    console.log('Slug:', slug);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/koku/${slug}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('API Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    // Veri kontrolü
    if (!data || typeof data !== 'object') {
      console.error('Geçersiz veri formatı:', data);
      throw new Error('API yanıtı geçerli bir format değil');
    }

    // Zorunlu alanların kontrolü
    const requiredFields = ['id', 'isim', 'slug', 'fiyat', 'kategori'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        console.error(`Eksik alan: ${field}`);
        throw new Error(`Eksik veri alanı: ${field}`);
      }
    }

    // Fotoğraf URL'lerinin kontrolü ve düzenlenmesi
    let fotograflar = Array.isArray(data.fotograflar) ? data.fotograflar : [];
    console.log('Ham Fotoğraf Verileri:', fotograflar);

    fotograflar = fotograflar
      .filter((foto: Fotograf) => {
        const isValid = foto && typeof foto.url === 'string' && foto.url.trim() !== '';
        if (!isValid) {
          console.log('Geçersiz fotoğraf verisi:', foto);
        }
        return isValid;
      })
      .map((foto: Fotograf, index: number) => {
        const processed = {
          url: foto.url,
          sira: foto.sira || index
        };
        console.log(`İşlenen fotoğraf ${index}:`, processed);
        return processed;
      })
      .sort((a: Fotograf, b: Fotograf) => a.sira - b.sira);

    console.log('Son işlenmiş fotoğraflar:', fotograflar);

    // Ana fotoğraf kontrolü
    console.log('Ana fotoğraf kontrolü başlıyor:', data.ana_fotograf);
    
    if (data.ana_fotograf && typeof data.ana_fotograf === 'string' && data.ana_fotograf.trim() !== '') {
      const anaFotoIndex = fotograflar.findIndex((f: Fotograf) => f.url === data.ana_fotograf);
      console.log('Ana fotoğraf index:', anaFotoIndex);
      
      if (anaFotoIndex === -1) {
        console.log('Ana fotoğraf listede yok, başa ekleniyor');
        fotograflar.unshift({ url: data.ana_fotograf, sira: -1 });
      } else if (anaFotoIndex !== 0) {
        console.log('Ana fotoğraf başa taşınıyor');
        const [anaFoto] = fotograflar.splice(anaFotoIndex, 1);
        fotograflar.unshift(anaFoto);
      }
    } else if (fotograflar.length > 0) {
      console.log('Ana fotoğraf belirleniyor:', fotograflar[0].url);
      data.ana_fotograf = fotograflar[0].url;
    }

    const result = {
      ...data,
      fotograflar,
      ana_fotograf: data.ana_fotograf || (fotograflar[0]?.url || '')
    };
    
    console.log('Son işlenmiş veri:', result);
    return result;

  } catch (error) {
    console.error('Veri getirme hatası:', error);
    throw error;
  }
}

export default function UrunDetayContent({ params }: PageProps) {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/koku/${params.slug}`);
        
        if (!response.ok) {
          throw new Error('Koku bulunamadı');
        }

        const data = await response.json();
        setKoku(data);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        setHata(error instanceof Error ? error.message : 'Koku yüklenirken bir hata oluştu');
        toast.error('Koku yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    }

    if (params.slug) {
      kokuGetir();
    }
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
                    <Image
                      src={foto.url}
                      alt={`${koku.isim} - ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      quality={100}
                      onError={(e: any) => {
                        console.error('Resim yükleme hatası:', e);
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Slider */}
          {koku.fotograflar.length > 1 && (
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper"
                breakpoints={{
                  0: {
                    slidesPerView: 3,
                  },
                  640: {
                    slidesPerView: 4,
                  },
                  768: {
                    slidesPerView: 5,
                  },
                }}
              >
                {koku.fotograflar.map((foto, index) => (
                  <SwiperSlide key={index} className="!w-24 !h-24 cursor-pointer">
                    <div className="relative w-full h-full">
                      <Image
                        src={foto.url}
                        alt={`${koku.isim} thumbnail - ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="96px"
                        quality={75}
                        onError={(e: any) => {
                          console.error('Thumbnail yükleme hatası:', e);
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{koku.isim}</h1>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{koku.fiyat} ₺</p>
            <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
              {koku.hacim}
            </span>
          </div>

          <div className="prose prose-sm text-gray-700">
            <p>{koku.aciklama}</p>
          </div>

          {koku.koku_notlari && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Koku Notları</h3>
              <p className="text-gray-700">{koku.koku_notlari}</p>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={sepeteEkle}
              className="w-full py-3 px-8 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 