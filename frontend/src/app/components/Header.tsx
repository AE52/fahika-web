"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaShoppingCart, FaTimes, FaBars } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Header() {
  const router = useRouter();
  const { items } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Arama yapılırken bir hata oluştu');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Arama hatası:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            FAHİKA
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Ana Sayfa
            </Link>
            <Link href="/urunler" className="text-gray-600 hover:text-gray-900">
              Ürünler
            </Link>
            <Link href="/hakkimizda" className="text-gray-600 hover:text-gray-900">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-gray-900">
              İletişim
            </Link>
          </nav>

          {/* Arama ve Sepet */}
          <div className="flex items-center space-x-4">
            {/* Arama */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ürün ara..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="mt-4 space-y-2 max-h-96 overflow-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/urunler/${result.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={result.image || '/placeholder.jpg'}
                                alt={result.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="text-sm font-medium text-gray-900">{result.name}</h3>
                              <p className="text-sm text-gray-500">{result.category}</p>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{result.price} TL</span>
                          </Link>
                        ))}
                      </div>
                    ) : searchTerm.length >= 2 ? (
                      <p className="text-center py-4 text-gray-500">Sonuç bulunamadı</p>
                    ) : null}
                  </form>
                </div>
              )}
            </div>

            {/* Sepet */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <FaShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/urunler"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünler
              </Link>
              <Link
                href="/hakkimizda"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 