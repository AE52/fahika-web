'use client';

import { FaWhatsapp, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Iletisim() {
  const whatsappNumarasi = '905555555555';
  const instagramKullaniciAdi = 'fahikatr';
  const emailAdresi = 'info@fahika.com';
  const adres = 'İstanbul, Türkiye';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium mb-8">İletişim</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-lg text-gray-600 mb-8">
            Sorularınız, önerileriniz veya işbirliği talepleriniz için 
            bizimle aşağıdaki kanallardan iletişime geçebilirsiniz.
          </p>
          
          <div className="space-y-4">
            <a
              href={`https://wa.me/${whatsappNumarasi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-4 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              <FaWhatsapp size={24} />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm">7/24 Müşteri Hizmetleri</p>
              </div>
            </a>
            
            <a
              href={`https://instagram.com/${instagramKullaniciAdi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <FaInstagram size={24} />
              <div>
                <p className="font-medium">Instagram</p>
                <p className="text-sm">@{instagramKullaniciAdi}</p>
              </div>
            </a>
            
            <a
              href={`mailto:${emailAdresi}`}
              className="flex items-center space-x-4 p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FaEnvelope size={24} />
              <div>
                <p className="font-medium">E-posta</p>
                <p className="text-sm">{emailAdresi}</p>
              </div>
            </a>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
              <FaMapMarkerAlt size={24} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Adres</p>
                <p className="text-sm text-gray-600">{adres}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-medium mb-6">Sıkça Sorulan Sorular</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Kargo süresi ne kadardır?</h3>
              <p className="text-gray-600">
                Siparişleriniz 1-3 iş günü içinde kargoya verilir ve 
                ortalama 2-4 iş günü içinde teslim edilir.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">İade ve değişim yapabilir miyim?</h3>
              <p className="text-gray-600">
                Ürünlerimizde hijyen nedeniyle iade ve değişim yapılmamaktadır. 
                Ancak hasarlı veya hatalı ürün teslimatı durumunda değişim yapılabilir.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ödeme seçenekleri nelerdir?</h3>
              <p className="text-gray-600">
                WhatsApp üzerinden sipariş verdiğinizde, havale/EFT veya 
                kredi kartı ile ödeme yapabilirsiniz.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Toptan satış yapıyor musunuz?</h3>
              <p className="text-gray-600">
                Toptan satış için WhatsApp üzerinden bizimle iletişime 
                geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 