export default function KosullarVeSartlarPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">Koşullar ve Şartlar</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          FAHİKA web sitesini kullanmadan önce lütfen bu Koşullar ve Şartlar'ı dikkatle okuyunuz. 
          Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">1. Genel Hükümler</h2>
        <p>
          Bu web sitesi FAHİKA kozmetik limited şirketi tarafından işletilmektedir. Site üzerinden 
          sunulan tüm hizmetler, belirtilen koşullar çerçevesinde sağlanmaktadır.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">2. Üyelik</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sitemize üye olabilmek için 18 yaşını doldurmuş olmanız gerekmektedir.</li>
          <li>Üyelik bilgilerinizin doğru ve güncel olmasından siz sorumlusunuz.</li>
          <li>Hesap güvenliğiniz sizin sorumluluğunuzdadır.</li>
          <li>Hesabınızla yapılan tüm işlemlerden siz sorumlusunuz.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">3. Sipariş ve Ödeme</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Siparişleriniz, ödeme onayı alındıktan sonra işleme alınır.</li>
          <li>Ürün fiyatları ve stok durumu önceden haber verilmeksizin değiştirilebilir.</li>
          <li>Ödeme işlemleriniz SSL güvenlik sertifikası ile korunmaktadır.</li>
          <li>Hatalı veya eksik sipariş bilgileri nedeniyle yaşanacak gecikmelerden FAHİKA sorumlu değildir.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">4. Teslimat</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Siparişleriniz belirtilen teslimat süreleri içinde kargolanır.</li>
          <li>Teslimat süresi, ürün stok durumu ve kargo firmasının çalışma koşullarına göre değişebilir.</li>
          <li>Teslimat adresi bilgilerinin doğruluğundan müşteri sorumludur.</li>
          <li>Kargo firmasından kaynaklanan gecikmelerden FAHİKA sorumlu değildir.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">5. İade ve Değişim</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>İade ve değişim koşulları, İade ve Geri Ödeme Politikamızda belirtilmiştir.</li>
          <li>Kozmetik ürünlerde hijyen sebebiyle, ambalajı açılmış ürünlerin iadesi kabul edilmez.</li>
          <li>İade işlemleri için müşteri hizmetleriyle iletişime geçilmesi gerekmektedir.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">6. Fikri Mülkiyet Hakları</h2>
        <p>
          Web sitesinde yer alan tüm içerik (metin, görsel, logo, tasarım vb.) FAHİKA'nın mülkiyetindedir 
          ve telif hakları ile korunmaktadır. İçeriklerin izinsiz kullanımı yasaktır.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">7. Gizlilik</h2>
        <p>
          Kişisel verilerinizin işlenmesi ve korunması ile ilgili detaylı bilgi için Gizlilik Politikamızı 
          ve KVKK Aydınlatma Metnimizi inceleyebilirsiniz.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">8. Sorumluluk Sınırları</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>FAHİKA, web sitesinin kesintisiz ve hatasız çalışacağını garanti etmez.</li>
          <li>Sitede yer alan bilgilerde hatalar olabilir.</li>
          <li>FAHİKA, önceden haber vermeksizin site içeriğini değiştirme hakkını saklı tutar.</li>
          <li>Kullanıcıların site kullanımından doğacak zararlardan FAHİKA sorumlu değildir.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">9. Uyuşmazlık Çözümü</h2>
        <p>
          Bu koşullardan doğabilecek uyuşmazlıklarda İstanbul (Anadolu) Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">10. Değişiklikler</h2>
        <p>
          FAHİKA, bu Koşullar ve Şartlar'ı dilediği zaman değiştirme hakkını saklı tutar. 
          Değişiklikler sitede yayınlandığı tarihte yürürlüğe girer.
        </p>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p>
            Bu koşullarla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          <p className="mt-4">
            <strong>E-posta:</strong> iletisim@fahika.com<br />
            <strong>Telefon:</strong> +90 532 280 95 11
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>
    </div>
  );
} 