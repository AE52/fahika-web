export default function DestekPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">Müşteri Desteği</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          FAHİKA olarak, müşterilerimize en iyi hizmeti sunmak için buradayız. 
          Sorularınız, önerileriniz veya sorunlarınız için size yardımcı olmaktan mutluluk duyarız.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900">1. Siparişim ne zaman teslim edilecek?</h3>
            <p>
              Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir ve ortalama 2-4 iş günü 
              içinde teslim edilir. Kargo takip numaranız, siparişiniz kargoya verildiğinde size 
              e-posta ile iletilecektir.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">2. Ürün iadesi nasıl yapılır?</h3>
            <p>
              Ürünlerinizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. İade sürecini 
              başlatmak için müşteri hizmetlerimizle iletişime geçmeniz yeterlidir. Detaylı bilgi 
              için İade ve Geri Ödeme Politikamızı inceleyebilirsiniz.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">3. Ödeme seçenekleri nelerdir?</h3>
            <p>
              Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kullanabilirsiniz. 
              Tüm ödemeleriniz SSL güvenlik sertifikası ile korunmaktadır.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900">4. Kargo ücreti ne kadar?</h3>
            <p>
              150 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 150 TL altındaki siparişlerinizde 
              sabit kargo ücreti uygulanır.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">Bize Ulaşın</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
            <ul className="space-y-4">
              <li>
                <strong>Adres:</strong><br />
                Burhaniye Mahallesi. Kağıtçıbaşı Sokak. No: 48/B Üsküdar İstanbul
              </li>
              <li>
                <strong>E-posta:</strong><br />
                iletisim@fahika.com
              </li>
              <li>
                <strong>Telefon:</strong><br />
                +90 532 280 95 11
              </li>
              <li>
                <strong>Çalışma Saatleri:</strong><br />
                Pazartesi - Cuma: 09:00 - 18:00
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">Hızlı Destek</h3>
            <ul className="space-y-4">
              <li>
                <strong>Sipariş Takibi</strong><br />
                Siparişinizin durumunu öğrenmek için sipariş numaranızı e-posta ile iletebilirsiniz.
              </li>
              <li>
                <strong>İade Talebi</strong><br />
                İade talebinizi e-posta veya telefon yoluyla iletebilirsiniz.
              </li>
              <li>
                <strong>Şikayet ve Öneriler</strong><br />
                Her türlü şikayet ve önerinizi bizimle paylaşabilirsiniz.
              </li>
              <li>
                <strong>Teknik Destek</strong><br />
                Web sitemiz ile ilgili teknik sorunlarınızı bize bildirebilirsiniz.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Size daha iyi hizmet verebilmek için çalışıyoruz. Sorularınız için 7/24 e-posta yoluyla 
            bizimle iletişime geçebilirsiniz. E-postalarınıza en kısa sürede yanıt vermeye çalışacağız.
          </p>
        </div>
      </div>
    </div>
  );
} 