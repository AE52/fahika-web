export default function CerezPolitikasiPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">Çerez Politikası</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          FAHİKA olarak, web sitemizi ziyaret ettiğinizde çerezler kullanıyoruz. Bu politika, 
          hangi çerezleri kullandığımızı ve bunları nasıl kontrol edebileceğinizi açıklamaktadır.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">1. Çerez Nedir?</h2>
        <p>
          Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız tarafından bilgisayarınıza veya 
          mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitemizi nasıl 
          kullandığınız hakkında bilgi toplar ve size daha iyi bir kullanıcı deneyimi sunmamıza 
          yardımcı olur.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">2. Kullandığımız Çerez Türleri</h2>
        <p>
          Web sitemizde aşağıdaki çerez türlerini kullanıyoruz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Zorunlu Çerezler:</strong> Web sitemizin düzgün çalışması için gerekli olan 
            çerezlerdir. Bu çerezler olmadan web sitemizin bazı özellikleri kullanılamaz.
          </li>
          <li>
            <strong>Performans Çerezleri:</strong> Ziyaretçilerin web sitemizi nasıl kullandığını 
            anlamamıza yardımcı olan çerezlerdir. Bu bilgiler, sitemizi iyileştirmek için kullanılır.
          </li>
          <li>
            <strong>İşlevsellik Çerezleri:</strong> Size daha gelişmiş ve kişiselleştirilmiş bir 
            deneyim sunmak için kullanılan çerezlerdir.
          </li>
          <li>
            <strong>Hedefleme/Reklam Çerezleri:</strong> Size ilgi alanlarınıza göre özelleştirilmiş 
            reklamlar göstermek için kullanılan çerezlerdir.
          </li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">3. Çerezlerin Kullanım Amaçları</h2>
        <p>
          Çerezleri aşağıdaki amaçlarla kullanıyoruz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Web sitemizin temel işlevlerini sağlamak</li>
          <li>Kullanıcı deneyimini iyileştirmek</li>
          <li>Site kullanımı hakkında istatistiksel veriler toplamak</li>
          <li>Tercihlerinizi hatırlamak</li>
          <li>Size özelleştirilmiş içerik ve reklamlar sunmak</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">4. Çerezleri Kontrol Etme</h2>
        <p>
          Çerezleri kabul etmek zorunda değilsiniz. Tarayıcınızın ayarlarını değiştirerek çerezleri 
          engelleyebilir veya silebilirsiniz. Ancak bu, web sitemizin bazı özelliklerinin düzgün 
          çalışmamasına neden olabilir.
        </p>
        <p className="mt-4">
          Çerezleri kontrol etmek için tarayıcınızın ayarlarını nasıl değiştirebileceğinizi 
          öğrenmek için aşağıdaki bağlantıları kullanabilirsiniz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Safari</li>
          <li>Internet Explorer</li>
          <li>Microsoft Edge</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">5. Üçüncü Taraf Çerezleri</h2>
        <p>
          Web sitemizde üçüncü taraf hizmet sağlayıcılarının çerezleri de bulunabilir. Bu çerezler, 
          analiz, reklam ve sosyal medya özellikleri gibi hizmetleri sağlamak için kullanılır. 
          Bu üçüncü tarafların çerez kullanımları kendi gizlilik politikalarına tabidir.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">6. Çerez Politikası Değişiklikleri</h2>
        <p>
          Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olması 
          durumunda sizi bilgilendireceğiz. Politikanın güncel versiyonunu web sitemizde 
          bulabilirsiniz.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">7. İletişim</h2>
        <p>
          Çerez politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
        </p>
        <p className="mt-4">
          <strong>Adres:</strong> Burhaniye Mahallesi. Kağıtçıbaşı Sokak. No: 48/B Üsküdar İstanbul<br />
          <strong>E-posta:</strong> iletisim@fahika.com<br />
          <strong>Telefon:</strong> +90 532 280 95 11
        </p>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p>
            Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>
    </div>
  );
} 