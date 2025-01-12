'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    isim: '',
    email: '',
    telefon: '',
    mesaj: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Form gönderme işlemi burada yapılacak
      toast.success('Mesajınız başarıyla gönderildi.');
      setFormData({ isim: '', email: '', telefon: '', mesaj: '' });
    } catch (error) {
      toast.error('Mesajınız gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* İletişim Bilgileri */}
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
          </div>

          <div className="prose prose-lg">
            <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Çalışma Saatleri</h2>
            <p className="text-sm text-gray-600">
              Pazartesi - Cumartesi: 09:00 - 18:00<br />
              Pazar: Kapalı
            </p>
          </div>
        </div>

        {/* İletişim Formu */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="isim" className="block text-sm font-medium text-gray-700">
                İsim Soyisim
              </label>
              <input
                type="text"
                id="isim"
                value={formData.isim}
                onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-none shadow-sm focus:ring-black focus:border-black sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-none shadow-sm focus:ring-black focus:border-black sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="telefon" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                id="telefon"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-none shadow-sm focus:ring-black focus:border-black sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="mesaj" className="block text-sm font-medium text-gray-700">
                Mesajınız
              </label>
              <textarea
                id="mesaj"
                rows={4}
                value={formData.mesaj}
                onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-none shadow-sm focus:ring-black focus:border-black sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 