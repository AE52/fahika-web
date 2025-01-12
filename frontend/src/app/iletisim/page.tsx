'use client';

import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

export default function IletisimPage() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/905322809511', '_blank');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">İletişim</h1>
      
      <div className="max-w-2xl">
        <div className="space-y-6">
          <div className="prose prose-lg">
            <p>
              Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçebilirsiniz. 
              Size en kısa sürede dönüş yapacağız.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image src="/icons/wd-cursor-dark.svg" alt="Adres" width={20} height={20} />
              <p className="text-sm text-gray-600">
                Burhaniye Mahallesi. Kağıtçıbaşı Sokak.<br />
                No: 48/B Üsküdar İstanbul
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Image src="/icons/wd-phone-dark.svg" alt="Telefon" width={20} height={20} />
              <p className="text-sm text-gray-600">
                Telefon: +90 532 280 95 11
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Image src="/icons/wd-envelope-dark.svg" alt="E-posta" width={20} height={20} />
              <p className="text-sm text-gray-600">
                iletisim@fahika.com
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaWhatsapp className="w-5 h-5 text-green-500" />
              <button 
                onClick={handleWhatsApp}
                className="text-sm text-gray-600 hover:text-green-500 transition-colors"
              >
                WhatsApp ile İletişime Geç
              </button>
            </div>
          </div>

          <div className="prose prose-lg">
            <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Çalışma Saatleri</h2>
            <p className="text-sm text-gray-600">
              Pazartesi - Cumartesi: 09:00 - 18:00<br />
              Pazar: Kapalı
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 