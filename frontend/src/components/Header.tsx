'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

// Üst banner mesajları
const bannerMessages = [
  "Sepette %10 indirim fırsatını kaçırmayın! 🎉",
  "Kargo bedava kampanyası devam ediyor! 🚚",
  "Yeni gelen ürünlerde özel fiyatlar! ✨"
];

// Menü öğeleri
const menuItems = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Header() {
  const pathname = usePathname();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    slug: string;
    isim: string;
    fiyat: number;
    kategori: string;
    ana_fotograf: string;
    hacim: string;
  }>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<Array<{
    id: string;
    slug: string;
    isim: string;
    fiyat: number;
    kategori: string;
    ana_fotograf: string;
    hacim: string;
  }>>([]);

  // Banner mesajlarını döndür
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === bannerMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Tüm ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular`);
        if (!response.ok) throw new Error('Ürünler getirilemedi');
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Ürün getirme hatası:', error);
      }
    };

    fetchProducts();
  }, []);

  // Arama işlemi
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      const searchTerm = searchQuery.toLowerCase().trim();
      const filteredResults = allProducts.filter(product =>
        product.isim.toLowerCase().includes(searchTerm) ||
        product.kategori.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  // Arama formunu gönder
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  // Toplam tutarı hesapla
  const toplamTutar = cart.reduce((total, item) => total + item.fiyat * item.miktar, 0);

  // WhatsApp siparişi
  const whatsappSiparisVer = () => {
    const mesaj = `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${cart
      .map(item => `${item.isim} (${item.hacim}) - ${item.miktar} adet - ${item.fiyat} TL`)
      .join('\n')}\n\nToplam Tutar: ${toplamTutar} TL`;

    window.open(
      `https://wa.me/905555555555?text=${encodeURIComponent(mesaj)}`,
      '_blank'
    );
  };

  return (
    <>
      {/* Üst Banner */}
      <div className="bg-black text-white py-2 text-center relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          <div className="w-full flex-shrink-0 animate-fade-in-out">
            {bannerMessages[currentBannerIndex]}
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <Link href="/" className="text-2xl font-bold text-gray-900 ml-2 md:ml-0">
                FAHİKA
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Ara"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Sepet"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil Menü */}
      <div className={`fixed inset-0 z-50 overflow-hidden md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-light">Menü</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Arama Modalı */}
      <div className={`fixed inset-0 z-50 overflow-y-auto ${isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isSearchOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
        />
        
        <div className={`fixed inset-x-0 top-0 bg-white transform transition-all duration-300 ${
          isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">Ara</h2>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ne aramıştınız?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-900 transition-colors"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                ) : (
                  <FiSearch className="w-5 h-5" />
                )}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/kokularimiz/${result.slug}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={result.ana_fotograf}
                        alt={result.isim}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{result.isim}</h3>
                      <p className="text-sm text-gray-500">{result.hacim}</p>
                      <p className="text-sm font-medium mt-1">
                        {result.fiyat.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8 text-gray-500">
                Sonuç bulunamadı
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sepet Modalı */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-light">Sepetim ({cart.length} Ürün)</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <p className="text-gray-500 mb-6 text-lg">Sepetiniz boş</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Alışverişe Başla
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="relative w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.ana_fotograf}
                              alt={item.isim}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-light text-lg mb-1">{item.isim}</h3>
                            <p className="text-sm text-gray-500 mb-4">{item.hacim}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.miktar - 1))}
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center border-x py-1">{item.miktar}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.miktar + 1)}
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-light text-lg">
                                  {(item.fiyat * item.miktar).toLocaleString('tr-TR')} ₺
                                </span>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t p-6 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-light">Toplam</span>
                      <span className="font-medium">{toplamTutar.toLocaleString('tr-TR')} ₺</span>
                    </div>

                    <button
                      onClick={whatsappSiparisVer}
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-lg hover:bg-[#20BD5C] transition-colors text-lg"
                    >
                      <FaWhatsapp className="w-6 h-6" />
                      WhatsApp ile Sipariş Ver
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 