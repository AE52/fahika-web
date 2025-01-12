'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSearch, FiMenu, FiShoppingBag, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  isim: string;
  fiyat: number;
  ana_fotograf: string;
  hacim: string;
  slug: string;
}

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  // Arama işlevi
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length >= 2) {
        try {
          // Anasayfadaki ürünleri al
          const productElements = document.querySelectorAll('[data-product-info]');
          const products = Array.from(productElements).map(element => {
            const dataStr = element.getAttribute('data-product-info');
            if (!dataStr) return null;
            try {
              return JSON.parse(dataStr);
            } catch (e) {
              console.error('JSON parse hatası:', e);
              return null;
            }
          }).filter((item): item is SearchResult => item !== null);

          console.log('Bulunan ürünler:', products); // Debug için

          const searchLower = searchQuery.toLowerCase().trim();
          const filtered = products.filter(item => {
            const nameMatch = item.isim.toLowerCase().includes(searchLower);
            const volumeMatch = item.hacim.toLowerCase().includes(searchLower);
            return nameMatch || volumeMatch;
          });

          console.log('Arama sonuçları:', filtered); // Debug için
          setSearchResults(filtered);
        } catch (error) {
          console.error('Arama hatası:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      console.log('Arama sonuçları:', searchResults);
    }
  };

  // WhatsApp mesajı oluştur
  const createWhatsAppMessage = (cart: any[]) => {
    const message = `Merhaba, aşağıdaki ürünleri satın almak istiyorum:\n\n${cart
      .map(item => `${item.isim} (${item.hacim}) - ${item.miktar} adet - ${(item.fiyat * item.miktar).toLocaleString('tr-TR')} ₺`)
      .join('\n')}\n\nToplam Tutar: ${totalPrice.toLocaleString('tr-TR')} ₺`;
    
    return encodeURIComponent(message);
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/FAHIKA-LOGO.png"
              alt="Fahika Logo"
              width={120}
              height={40}
              style={{ width: 'auto', height: '40px' }}
              className="w-auto"
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Anasayfa
          </Link>
          <Link href="/hakkimizda" className="text-gray-700 hover:text-gray-900">
            Hakkımızda
          </Link>
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Kokularımız
          </Link>
          <Link href="/iletisim" className="text-gray-700 hover:text-gray-900">
            İletişim
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Arama Butonu */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <FiSearch className="w-6 h-6" />
          </button>

          {/* Sepet Butonu */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-gray-700 hover:text-gray-900 relative"
          >
            <FiShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger Menü */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hamburger Menü Modal */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-medium">Menü</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
              <IoClose className="w-6 h-6" />
            </button>
          </div>
          <div className="py-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link 
                  href="/hakkimizda" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kokularımız
                </Link>
              </li>
              <li>
                <Link 
                  href="/iletisim" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link 
                  href="/destek" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Destek
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Arama Modal */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSearchOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSearchOpen(false)} />
        <div className="absolute top-0 left-0 w-full bg-white shadow-lg">
          <div className="max-w-[1440px] mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Ara</h2>
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ne aramıştınız?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>

            {/* Arama Sonuçları */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/kokular/${result.id}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={result.ana_fotograf}
                        alt={result.isim}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{result.isim}</h3>
                      <p className="text-sm text-gray-500">{result.hacim}</p>
                      <p className="text-sm font-medium mt-1">{result.fiyat.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="text-center text-gray-500 mt-8">Sonuç bulunamadı</p>
            )}
          </div>
        </div>
      </div>

      {/* Sepet Modal */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-medium">Sepetim ({totalItems} Ürün)</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Sepetiniz boş</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.ana_fotograf}
                        alt={item.isim}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.isim}</h3>
                      <p className="text-sm text-gray-500">{item.hacim}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.miktar - 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.miktar}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.miktar + 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-right mt-2 font-medium">
                        {(item.fiyat * item.miktar).toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Toplam</span>
                  <span className="font-medium text-lg">
                    {totalPrice.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <button
                  onClick={() => {
                    const message = createWhatsAppMessage(cart);
                    window.open(`https://wa.me/905322809511?text=${message}`, '_blank');
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp ile Sipariş Ver</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* WhatsApp Widget */}
      <a
        href="https://wa.me/905322809511"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
    </header>
  );
} 