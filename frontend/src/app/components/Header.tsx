'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { supabase } from '@/lib/supabase';

interface Koku {
  id: number;
  slug: string;
  isim: string;
  fotograflar: { url: string; sira: number; }[];
  ana_fotograf: string | null;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

export default function Header() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [sonuclar, setSonuclar] = useState<Koku[]>([]);
  const [sonuclarGoster, setSonuclarGoster] = useState(false);
  const aramaPaneliRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aramaPaneliRef.current && !aramaPaneliRef.current.contains(event.target as Node)) {
        setSonuclarGoster(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const aramaYap = async (metin: string) => {
    if (!metin.trim()) {
      setSonuclar([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('urunler')
        .select('*')
        .or(`isim.ilike.%${metin}%,aciklama.ilike.%${metin}%,kategori.ilike.%${metin}%`)
        .limit(5);

      if (error) throw error;
      setSonuclar(data || []);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSonuclar([]);
    }
  };

  const handleAramaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aramaMetni.trim()) {
      router.push(`/arama?q=${encodeURIComponent(aramaMetni)}`);
      setSonuclarGoster(false);
      setMenuAcik(false);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Fahika
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-600 hover:text-gray-800 transition-colors ${
                pathname === '/' ? 'font-medium' : ''
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/kokularimiz"
              className={`text-gray-600 hover:text-gray-800 transition-colors ${
                pathname === '/kokularimiz' ? 'font-medium' : ''
              }`}
            >
              Kokular
            </Link>
            <Link
              href="/hakkimizda"
              className={`text-gray-600 hover:text-gray-800 transition-colors ${
                pathname === '/hakkimizda' ? 'font-medium' : ''
              }`}
            >
              Hakkımızda
            </Link>
          </nav>

          {/* Arama ve Menü */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={aramaPaneliRef}>
              <form onSubmit={handleAramaSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Koku ara..."
                  value={aramaMetni}
                  onChange={(e) => {
                    setAramaMetni(e.target.value);
                    aramaYap(e.target.value);
                    setSonuclarGoster(true);
                  }}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>

              {sonuclarGoster && sonuclar.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
                  {sonuclar.map((koku) => (
                    <Link
                      key={koku.id}
                      href={`/kokularimiz/${koku.slug}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSonuclarGoster(false);
                        setMenuAcik(false);
                      }}
                    >
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={koku.ana_fotograf || koku.fotograflar[0]?.url || '/placeholder.jpg'}
                          alt={koku.isim}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">{koku.isim}</h3>
                        <p className="text-xs text-gray-500">{koku.kategori}</p>
                      </div>
                      <span className="ml-auto text-sm font-medium text-gray-800">{koku.fiyat} TL</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setMenuAcik(!menuAcik)}
              className="md:hidden text-gray-600 hover:text-gray-800"
            >
              {menuAcik ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {menuAcik && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-gray-800"
              onClick={() => setMenuAcik(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/kokularimiz"
              className="block py-2 text-gray-600 hover:text-gray-800"
              onClick={() => setMenuAcik(false)}
            >
              Kokular
            </Link>
            <Link
              href="/hakkimizda"
              className="block py-2 text-gray-600 hover:text-gray-800"
              onClick={() => setMenuAcik(false)}
            >
              Hakkımızda
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 