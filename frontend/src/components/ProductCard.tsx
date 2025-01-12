"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

interface ProductCardProps {
  koku: Koku;
  onSepeteEkle?: (koku: Koku) => void;
}

const ProductCard = ({ koku, onSepeteEkle }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!koku || !koku.ana_fotograf) {
    console.warn('Geçersiz koku verisi:', koku);
    return null;
  }

  return (
    <div 
      className="group relative bg-white"
      data-product-info={JSON.stringify({
        id: koku.id,
        isim: koku.isim,
        fiyat: koku.fiyat,
        ana_fotograf: koku.ana_fotograf,
        hacim: koku.hacim,
        slug: koku.slug
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/kokularimiz/${koku.slug}`} className="block relative">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <Image
            src={koku.ana_fotograf}
            alt={koku.isim}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            priority
          />
          {onSepeteEkle && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSepeteEkle(koku);
                }}
                className="w-full py-2 text-white text-xs font-medium hover:text-gray-200 transition-colors uppercase tracking-wider"
              >
                Sepete Ekle
              </button>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 text-center">
        <Link href={`/kokularimiz/${koku.slug}`}>
          <h3 className="text-xs font-medium text-gray-900 mb-1 hover:text-gray-700 transition-colors uppercase tracking-wider">
            {koku.isim}
          </h3>
        </Link>
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-900">
              {koku.fiyat.toLocaleString('tr-TR')} ₺
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-gray-500">
            <span className="uppercase">{koku.kategori}</span>
            {koku.hacim && (
              <>
                <span>•</span>
                <span>{koku.hacim}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 