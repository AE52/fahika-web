'use client';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hakkımızda</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Biz Kimiz?</h2>
          <p className="text-gray-700 leading-relaxed">
            Fahika olarak, koku tutkunları için özel olarak seçilmiş parfüm ve oda kokularını sizlerle buluşturuyoruz. 
            Amacımız, her anınızı özel kılacak, size ve yaşam alanlarınıza uygun kokular sunmaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
          <p className="text-gray-700 leading-relaxed">
            Kaliteli ve özgün kokuları erişilebilir fiyatlarla sunarak, 
            müşterilerimizin hayatlarına değer katmak ve unutulmaz kokusal deneyimler yaşatmaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
          <p className="text-gray-700 leading-relaxed">
            Türkiye'nin lider koku markası olarak, müşterilerimize en kaliteli ürünleri 
            ve en iyi alışveriş deneyimini sunmayı hedefliyoruz.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Değerlerimiz</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Müşteri memnuniyeti odaklı hizmet</li>
            <li>Yüksek kalite standartları</li>
            <li>Şeffaflık ve dürüstlük</li>
            <li>Sürdürülebilir üretim</li>
            <li>Yenilikçi yaklaşım</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 