import Link from 'next/link';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-sm font-medium tracking-wider text-gray-800 mb-4">HAKKIMIZDA</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Özel tasarım parfümlerimizle size eşsiz kokular sunuyoruz. Her bir parfümümüz, benzersiz hikayeleri ve karakteri olan özel bir deneyim sunar.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider text-gray-800 mb-4">HIZLI ERİŞİM</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Kokular
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider text-gray-800 mb-4">İLETİŞİM</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaWhatsapp className="text-gray-600" />
                <span className="text-sm text-gray-600">+90 555 555 5555</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaInstagram className="text-gray-600" />
                <a
                  href="https://www.instagram.com/fahikatr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  @fahikatr
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider text-gray-800 mb-4">BÜLTEN</h3>
            <p className="text-sm text-gray-600 mb-4">
              Yeni ürünlerimizden ve özel fırsatlardan haberdar olmak için bültenimize kayıt olun.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 text-sm border-b border-gray-300 focus:border-gray-800 bg-transparent outline-none transition-all"
              />
              <button className="px-6 py-2 bg-gray-800 text-white text-sm tracking-wider hover:bg-gray-700 transition-colors">
                KAYIT OL
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-600">&copy; 2024 FAHIKA. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 