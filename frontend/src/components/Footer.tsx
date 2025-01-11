'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const whatsappNumarasi = '905555555555';

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-medium mb-4">Hakkımızda</h3>
            <p className="text-gray-400 text-sm">
              Fahika, yaşam alanlarınız için özel tasarlanmış kokular sunar. 
              Doğal ve kaliteli hammaddelerle üretilen ürünlerimiz, 
              mekanlarınıza benzersiz bir atmosfer katar.
            </p>
          </div>

          {/* Koleksiyonlar */}
          <div>
            <h3 className="text-lg font-medium mb-4">Koleksiyonlar</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Kokular
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Oda Kokuları
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Parfümler
                </Link>
              </li>
            </ul>
          </div>

          {/* Hesabım */}
          <div>
            <h3 className="text-lg font-medium mb-4">Hesabım</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/sepet" className="hover:text-white">
                  Sepetim
                </Link>
              </li>
              <li>
                <Link href="/favoriler" className="hover:text-white">
                  Favorilerim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-medium mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/iletisim" className="hover:text-white">
                  İletişim Formu
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumarasi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sosyal Medya ve Telif Hakkı */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Fahika. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumarasi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 