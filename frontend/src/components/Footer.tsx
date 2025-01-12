'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Slogan */}
          <div className="col-span-1">
            <Link href="/" className="block mb-4">
              <Image 
                src="/FAHIKA-LOGO.png"
                alt="Fahika Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm mt-4">
              Hayatınıza dokunan anılarınızı eşsiz kokularla taçlandırıyor
            </p>
          </div>

          {/* Ana Menü */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Ana Menü</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-gray-900">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Kokularımız
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-gray-900">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Kurumsal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="text-gray-600 hover:text-gray-900">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/geri-odeme-ve-iade" className="text-gray-600 hover:text-gray-900">
                  Geri Ödeme ve İade Politikası
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-gray-600 hover:text-gray-900">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-gray-900">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-gray-600 hover:text-gray-900">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/kosullar-ve-sartlar" className="text-gray-600 hover:text-gray-900">
                  Koşullar ve Şartlar
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">İletişim</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <strong className="block text-gray-900">Adres:</strong>
                Burhaniye Mahallesi. Kağıtçıbaşı Sokak. No: 48/B Üsküdar İstanbul
              </li>
              <li>
                <strong className="block text-gray-900">E-posta:</strong>
                iletisim@fahika.com
              </li>
              <li>
                <strong className="block text-gray-900">Telefon:</strong>
                +90 532 280 95 11
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex justify-center space-x-6 mb-4">
            <a
              href="https://instagram.com/fahikatr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/905322809511"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </div>
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FAHİKA. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 