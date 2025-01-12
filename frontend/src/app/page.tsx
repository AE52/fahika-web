'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

// Banner komponenti
function Banner() {
  const banners = [
    {
      id: 1,
      image: '/images/banner1.jpg',
      title: 'Yeni Koleksiyon',
      description: 'Eşsiz kokularla tanışın',
      buttonText: 'Keşfet',
      gradient: 'from-purple-600/50 to-pink-600/50',
    },
    {
      id: 2,
      image: '/images/banner2.jpg',
      title: 'Oda Kokuları',
      description: 'Evinize ferahlık katın',
      buttonText: 'İncele',
      gradient: 'from-blue-600/50 to-emerald-600/50',
    },
  ];

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="aspect-[21/9] w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-6xl font-light mb-4"
                >
                  {banner.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl mb-8"
                >
                  {banner.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    href="/"
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {banner.buttonText}
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function Home() {
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [seciliKategori, setSeciliKategori] = useState<string>('tumu');
  const [siralama, setSiralama] = useState<string>('varsayilan');
  const { addToCart } = useCart();

  useEffect(() => {
    const kokulariGetir = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular`);
        
        if (!response.ok) {
          throw new Error(`Kokular getirilemedi: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.kokular) {
          throw new Error('API yanıtında kokular verisi bulunamadı');
        }
        
        setKokular(data.kokular);
        setHata(null);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        setHata('Kokular yüklenirken bir hata oluştu');
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
        case 'yeni-eski':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'eski-yeni':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
    toast.success('Koku sepete eklendi');
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

  if (kokular.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Henüz koku bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <Banner />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtreler */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSeciliKategori('tumu')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
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
            className="px-4 py-2 border border-gray-200 rounded-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="varsayilan">Varsayılan Sıralama</option>
            <option value="fiyat-artan">Fiyat: Düşükten Yükseğe</option>
            <option value="fiyat-azalan">Fiyat: Yüksekten Düşüğe</option>
            <option value="isim-a-z">İsim: A-Z</option>
            <option value="isim-z-a">İsim: Z-A</option>
            <option value="yeni-eski">En Yeniler</option>
            <option value="eski-yeni">En Eskiler</option>
          </select>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {filtrelenmisKokular.map((koku) => (
            <ProductCard
              key={koku.id}
              koku={koku}
              onSepeteEkle={sepeteEkle}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
