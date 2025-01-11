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
            <Link href="/kokularimiz" className="text-gray-700 hover:text-gray-900">
              Kokularımız
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 hover:text-gray-900"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <FaShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>

          {/* Mobil Menü */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 hover:text-gray-900"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <FaShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sepet Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Sepetim ({totalItems})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            {/* Sepet içeriği buraya gelecek */}
          </div>
        </div>
      )}

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
    </header>
  );
} 