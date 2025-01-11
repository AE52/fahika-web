'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Fotograf {
  url: string;
  sira: number;
}

interface Koku {
  id: string;
  slug: string;
  isim: string;
  fotograflar: Fotograf[];
  ana_fotograf: string;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

export default function KokuDetay({ params }: { params: { slug: string } }) {
  const [koku, setKoku] = useState<Koku | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifFotoIndex, setAktifFotoIndex] = useState(0);
  const [buyukFotoGoster, setBuyukFotoGoster] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const kokuGetir = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/kokular/slug/${params.slug}`);
        if (!response.ok) throw new Error('Koku bulunamadı');
        const data = await response.json();
        setKoku(data);
      } catch (error) {
        console.error('Koku getirme hatası:', error);
        toast.error('Koku yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    };

    kokuGetir();
  }, [params.slug]);

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

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!koku) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Koku Bulunamadı</h1>
        <p className="text-gray-600 mb-8">Aradığınız koku bulunamadı veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Fotoğraf Galerisi */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            effect="fade"
            speed={500}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
          >
            {koku.fotograflar.map((foto, index) => (
              <SwiperSlide key={foto.url}>
                <div className="relative w-full h-full cursor-zoom-in" onClick={() => setBuyukFotoGoster(true)}>
                  <Image
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

        {/* Ürün Detayları */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light mb-4">{koku.isim}</h1>
            <div className="flex items-baseline space-x-4">
              <span className="text-2xl">{koku.fiyat} TL</span>
              <span className="text-gray-500">{koku.hacim}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Koku Notları</h2>
              <div className="flex flex-wrap gap-2">
                {koku.koku_notlari.split(',').map((nota, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm"
                  >
                    {nota.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Açıklama</h2>
              <p className="text-gray-600 leading-relaxed">{koku.aciklama}</p>
            </div>

            <div className="pt-6 border-t">
              <button
                onClick={sepeteEkle}
                disabled={koku.stok === 0}
                className={`w-full py-4 text-lg font-medium rounded-lg transition-colors ${
                  koku.stok > 0
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {koku.stok > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
              {koku.stok > 0 && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Stokta {koku.stok} adet bulunmaktadır
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Büyük Fotoğraf Modal */}
      <AnimatePresence>
        {buyukFotoGoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={() => setBuyukFotoGoster(false)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full mx-4">
              <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                speed={500}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                initialSlide={aktifFotoIndex}
                className="w-full h-full"
              >
                {koku.fotograflar.map((foto, index) => (
                  <SwiperSlide key={foto.url}>
                    <Image
                      src={foto.url}
                      alt={`${koku.isim} - ${index + 1}`}
                      width={1500}
                      height={2000}
                      className="object-contain w-full h-full"
                      priority={index === aktifFotoIndex}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 