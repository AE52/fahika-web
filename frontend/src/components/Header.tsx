'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart, FaSearch, FaWhatsapp, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { cart, totalPrice, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdmin(!!token);
    };

    checkAdmin();

    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleWhatsApp = () => {
    const message = cart.map(item => `${item.isim} - ${item.miktar} adet`).join('\n');
    const whatsappMessage = `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${message}\n\nToplam Tutar: ${totalPrice} TL`;
    window.open(`https://wa.me/905322809511?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    setIsCartModalOpen(false);
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/FAHIKA-LOGO.png"
              alt="Fahika Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-gray-700">
              Anasayfa
            </Link>
            <Link href="/hakkimizda" className="text-gray-900 hover:text-gray-700">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-900 hover:text-gray-700">
              İletişim
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-900 hover:text-gray-700">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-900 hover:text-gray-700 p-2"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsCartModalOpen(true)} 
              className="text-gray-900 hover:text-gray-700 relative p-2"
            >
              <FaShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-900 hover:text-gray-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Anasayfa
              </Link>
              <Link
                href="/hakkimizda"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
              >
                İletişim
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Ürün Ara</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ne aramıştınız?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Sepetim</h2>
            <button
              onClick={() => setIsCartModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FaShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">Sepetiniz boş</p>
                <button
                  onClick={() => {
                    setIsCartModalOpen(false);
                    router.push('/');
                  }}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.ana_fotograf}
                        alt={item.isim}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.isim}</h3>
                      <p className="text-sm text-gray-500">{item.hacim}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.miktar - 1)}
                            className="text-gray-500 hover:text-black"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.miktar}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.miktar + 1)}
                            className="text-gray-500 hover:text-black"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.fiyat * item.miktar} TL</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Toplam</span>
                <span className="text-xl font-bold">{totalPrice} TL</span>
              </div>
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
              >
                <FaWhatsapp className="h-5 w-5" />
                <span>WhatsApp ile Sipariş Ver</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for Cart Modal */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartModalOpen(false)}
        />
      )}
    </header>
  );
} 