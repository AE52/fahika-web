import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Koku {
  slug: string;
  isim: string;
  ana_fotograf: string;
  fotograflar: string[];
  fiyat: number;
  kategori: string;
  hacim: string;
  aciklama: string | null;
  stok: number;
  koku_notlari: string | null;
}

const products = [
  {
    slug: "buket-cicekleri-kokulu-cubuklu-oda-kokusu-110-ml",
    isim: "Buket Çiçekleri Kokulu Çubuklu Oda Kokusu",
    ana_fotograf: "https://fahika.com/wp-content/uploads/2024/01/buket-cicekleri-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
    fotograflar: [
      "https://fahika.com/wp-content/uploads/2024/01/buket-cicekleri-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
      "https://fahika.com/wp-content/uploads/2024/01/buket-cicekleri-kokulu-cubuklu-oda-kokusu-110-ml-2.jpg"
    ],
    fiyat: 200,
    kategori: "Çubuklu Oda Kokuları",
    hacim: "110 ml",
    aciklama: "Buket Çiçekleri kokulu çubuklu oda kokumuz, taze kesilmiş çiçeklerin büyüleyici kokusunu evinize taşır. Doğal ve kalıcı formülü ile yaşam alanlarınızda ferah bir atmosfer yaratır.",
    stok: 100,
    koku_notlari: "Üst Nota: Yasemin\nOrta Nota: Gül\nAlt Nota: Vanilya"
  },
  {
    slug: "vanilya-kokulu-cubuklu-oda-kokusu-110-ml",
    isim: "Vanilya Kokulu Çubuklu Oda Kokusu",
    ana_fotograf: "https://fahika.com/wp-content/uploads/2024/01/vanilya-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
    fotograflar: [
      "https://fahika.com/wp-content/uploads/2024/01/vanilya-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
      "https://fahika.com/wp-content/uploads/2024/01/vanilya-kokulu-cubuklu-oda-kokusu-110-ml-2.jpg"
    ],
    fiyat: 200,
    kategori: "Çubuklu Oda Kokuları",
    hacim: "110 ml",
    aciklama: "Vanilya kokulu çubuklu oda kokumuz, sıcak ve tatlı vanilya notalarıyla evinizi sarar. Rahatlatıcı ve huzur verici kokusuyla yaşam alanlarınıza sıcaklık katar.",
    stok: 100,
    koku_notlari: "Üst Nota: Vanilya\nOrta Nota: Karamel\nAlt Nota: Tonka Fasulyesi"
  },
  {
    slug: "kavun-kokulu-cubuklu-oda-kokusu-110-ml",
    isim: "Kavun Kokulu Çubuklu Oda Kokusu",
    ana_fotograf: "https://fahika.com/wp-content/uploads/2024/01/kavun-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
    fotograflar: [
      "https://fahika.com/wp-content/uploads/2024/01/kavun-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
      "https://fahika.com/wp-content/uploads/2024/01/kavun-kokulu-cubuklu-oda-kokusu-110-ml-2.jpg"
    ],
    fiyat: 200,
    kategori: "Çubuklu Oda Kokuları",
    hacim: "110 ml",
    aciklama: "Kavun kokulu çubuklu oda kokumuz, taze kesilmiş kavunun ferahlatıcı kokusunu evinize taşır. Yaz meyvelerinin tazeliğini yaşam alanlarınızda hissedin.",
    stok: 100,
    koku_notlari: "Üst Nota: Kavun\nOrta Nota: Yeşil Notalar\nAlt Nota: Misk"
  },
  {
    slug: "beyaz-cicekler-kokulu-cubuklu-oda-kokusu-110-ml",
    isim: "Beyaz Çiçekler Kokulu Çubuklu Oda Kokusu",
    ana_fotograf: "https://fahika.com/wp-content/uploads/2024/01/beyaz-cicekler-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
    fotograflar: [
      "https://fahika.com/wp-content/uploads/2024/01/beyaz-cicekler-kokulu-cubuklu-oda-kokusu-110-ml.jpg",
      "https://fahika.com/wp-content/uploads/2024/01/beyaz-cicekler-kokulu-cubuklu-oda-kokusu-110-ml-2.jpg"
    ],
    fiyat: 200,
    kategori: "Çubuklu Oda Kokuları",
    hacim: "110 ml",
    aciklama: "Beyaz Çiçekler kokulu çubuklu oda kokumuz, zarif beyaz çiçeklerin saf ve temiz kokusunu yaşam alanlarınıza taşır. Ferah ve zarif bir atmosfer yaratır.",
    stok: 100,
    koku_notlari: "Üst Nota: Zambak\nOrta Nota: Gardenya\nAlt Nota: Beyaz Misk"
  },
  {
    slug: "bogurtlen-kokulu-cubuklu-oda-kokusu-550-ml",
    isim: "Böğürtlen Kokulu Çubuklu Oda Kokusu",
    ana_fotograf: "https://fahika.com/wp-content/uploads/2024/01/bogurtlen-kokulu-cubuklu-oda-kokusu-550-ml.jpg",
    fotograflar: [
      "https://fahika.com/wp-content/uploads/2024/01/bogurtlen-kokulu-cubuklu-oda-kokusu-550-ml.jpg",
      "https://fahika.com/wp-content/uploads/2024/01/bogurtlen-kokulu-cubuklu-oda-kokusu-550-ml-2.jpg"
    ],
    fiyat: 900,
    kategori: "Çubuklu Oda Kokuları",
    hacim: "550 ml",
    aciklama: "Böğürtlen kokulu çubuklu oda kokumuz, taze böğürtlenlerin tatlı ve çarpıcı aromasını evinize taşır. Büyük boy şişesi ile uzun süreli kullanım sağlar.",
    stok: 100,
    koku_notlari: "Üst Nota: Böğürtlen\nOrta Nota: Orman Meyveleri\nAlt Nota: Amber"
  }
];

// MongoDB'ye yüklemek için API endpoint'i
const API_ENDPOINT = 'http://localhost:3000/api/kokular';

async function uploadProducts() {
  try {
    for (const product of products) {
      const response = await axios.post(API_ENDPOINT, product);
      console.log(`${product.isim} başarıyla yüklendi:`, response.data);
    }
    console.log('Tüm ürünler başarıyla yüklendi!');
  } catch (error) {
    console.error('Ürün yükleme hatası:', error);
  }
}

uploadProducts(); 