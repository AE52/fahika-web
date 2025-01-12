export default function GeriOdemeVeIadePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium text-gray-900 mb-8">Geri Ödeme ve İade Politikası</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          FAHİKA olarak, müşteri memnuniyetini en üst düzeyde tutmayı hedefliyoruz. Bu doğrultuda, iade ve geri ödeme süreçlerimizi şeffaf ve müşteri odaklı bir şekilde yönetiyoruz.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">İade Koşulları</h2>
        <p>
          Ürünlerimizin iadesi, aşağıdaki koşullar dahilinde yapılabilir:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ürün, teslim tarihinden itibaren 14 gün içinde iade edilebilir.</li>
          <li>İade edilecek ürün kullanılmamış ve orijinal ambalajında olmalıdır.</li>
          <li>Kozmetik ürünlerin hijyen bandı açılmamış olmalıdır.</li>
          <li>Ürün, tüm parçaları ve aksesuarları ile birlikte iade edilmelidir.</li>
          <li>Fatura veya teslimat belgesi, iade paketi içinde yer almalıdır.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">İade Süreci</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>İade talebinizi iletisim@fahika.com adresine e-posta göndererek veya müşteri hizmetlerimizi arayarak iletebilirsiniz.</li>
          <li>İade talebiniz onaylandıktan sonra, ürünü orijinal ambalajında ve tüm parçalarıyla birlikte paketleyiniz.</li>
          <li>Fatura veya teslimat belgesini paketin içine koyunuz.</li>
          <li>Ürünü, size bildirilen adrese kargo ile gönderiniz.</li>
          <li>İade edilen ürün tarafımıza ulaştıktan sonra kontrol edilecektir.</li>
          <li>Kontroller sonucunda iade koşullarına uygun bulunan ürünlerin bedeli iade edilecektir.</li>
        </ol>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">Geri Ödeme Süreci</h2>
        <p>
          İade işlemi onaylanan ürünlerin geri ödemesi aşağıdaki şekilde yapılır:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Kredi kartı ile yapılan ödemelerde, iade tutarı kredi kartınıza 7-14 iş günü içinde yansıtılacaktır.</li>
          <li>Havale/EFT ile yapılan ödemelerde, iade tutarı belirttiğiniz banka hesabına 3-5 iş günü içinde aktarılacaktır.</li>
          <li>Kapıda ödeme ile yapılan alışverişlerde, iade tutarı banka hesabınıza havale edilecektir.</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">İade Edilemeyecek Ürünler</h2>
        <p>
          Aşağıdaki durumlarda ürün iadesi kabul edilmemektedir:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Kullanılmış veya hasar görmüş ürünler</li>
          <li>Hijyen bandı açılmış kozmetik ürünler</li>
          <li>Orijinal ambalajı zarar görmüş ürünler</li>
          <li>Eksik parça veya aksesuar ile gönderilen ürünler</li>
          <li>14 günlük iade süresi geçmiş ürünler</li>
        </ul>

        <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">Kargo Ücretleri</h2>
        <p>
          İade kargo ücretleri aşağıdaki durumlara göre belirlenir:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ayıplı veya hatalı ürün teslimatlarında kargo ücreti FAHİKA tarafından karşılanır.</li>
          <li>Müşteri kaynaklı iadelerde kargo ücreti müşteri tarafından karşılanır.</li>
          <li>Promosyonlu veya kampanyalı ürünlerin iadelerinde, promosyon koşulları geçerlidir.</li>
        </ul>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p>
            İade ve geri ödeme süreçleri ile ilgili sorularınız için müşteri hizmetlerimize ulaşabilirsiniz:
          </p>
          <p className="mt-4">
            <strong>E-posta:</strong> iletisim@fahika.com<br />
            <strong>Telefon:</strong> +90 532 280 95 11
          </p>
        </div>
      </div>
    </div>
  );
} 