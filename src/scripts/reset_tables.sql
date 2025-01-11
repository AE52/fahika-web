-- Mevcut tabloları sil
DROP TABLE IF EXISTS urunler CASCADE;
DROP TABLE IF EXISTS sayfalar CASCADE;

-- Urunler tablosunu oluştur
CREATE TABLE urunler (
  id SERIAL PRIMARY KEY,
  isim TEXT NOT NULL,
  resimUrl TEXT NOT NULL,
  fiyat NUMERIC NOT NULL,
  aciklama TEXT NOT NULL,
  kategori TEXT NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  notlar TEXT[] DEFAULT '{}',
  hacim INTEGER NOT NULL DEFAULT 0,
  kokuTuru TEXT NOT NULL DEFAULT 'Belirtilmemiş',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Politikaları
ALTER TABLE urunler ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ürünleri herkes okuyabilir" ON urunler;
DROP POLICY IF EXISTS "Sadece yetkililer düzenleyebilir" ON urunler;
CREATE POLICY "Ürünleri herkes okuyabilir" ON urunler FOR SELECT USING (true);
CREATE POLICY "Sadece yetkililer düzenleyebilir" ON urunler FOR ALL USING (auth.role() = 'authenticated');

-- Örnek ürün verileri
INSERT INTO urunler (isim, resimUrl, fiyat, aciklama, kategori, stok, notlar, hacim, kokuTuru) VALUES
('Lavanta Rüyası', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-1.jpg', 1250, 'Lavanta ve vanilya notalarının büyüleyici uyumu. Rahatlatıcı ve huzur verici bir koku.', 'Çiçeksi', 50, ARRAY['Lavanta', 'Vanilya', 'Paçuli'], 100, 'Çiçeksi'),
('Oryantal Gece', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-2.jpg', 1500, 'Doğu''nun gizemli baharatları ve amber notalarının sofistike birleşimi.', 'Oryantal', 30, ARRAY['Amber', 'Sandal Ağacı', 'Baharat'], 100, 'Oryantal'),
('Akdeniz Esintisi', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-3.jpg', 1350, 'Narenciye ve deniz notalarıyla ferahlatıcı bir yaz esintisi.', 'Ferah', 45, ARRAY['Bergamot', 'Limon', 'Deniz Tuzu'], 100, 'Narenciye'),
('Orman Sırrı', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-4.jpg', 1450, 'Çam ve sedir ağacının doğal aromalarıyla orman yürüyüşüne davet.', 'Odunsu', 35, ARRAY['Çam', 'Sedir', 'Yosun'], 100, 'Odunsu'),
('Gül Bahçesi', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-5.jpg', 1650, 'Taze gül ve yasemin notalarının zarif buluşması.', 'Çiçeksi', 25, ARRAY['Gül', 'Yasemin', 'Misk'], 100, 'Çiçeksi'),
('Misk & Amber', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-6.jpg', 1550, 'Misk ve amber notalarının sıcak ve baştan çıkarıcı uyumu.', 'Oryantal', 40, ARRAY['Misk', 'Amber', 'Vanilya'], 100, 'Oryantal'),
('Yağmur Ormanı', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-7.jpg', 1400, 'Yeşil yapraklar ve yağmur sonrası toprak kokusunun tazeleyici harmonisi.', 'Yeşil', 30, ARRAY['Yeşil Yapraklar', 'Toprak', 'Yağmur'], 100, 'Yeşil'),
('Karamel Rüyası', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-8.jpg', 1300, 'Tatlı karamel ve vanilya notalarının gourmand buluşması.', 'Gourmand', 35, ARRAY['Karamel', 'Vanilya', 'Badem'], 100, 'Gourmand');

-- Sayfalar tablosunu oluştur
CREATE TABLE sayfalar (
  id SERIAL PRIMARY KEY,
  baslik TEXT NOT NULL,
  icerik TEXT NOT NULL,
  resimUrl TEXT NOT NULL,
  tip TEXT NOT NULL CHECK (tip IN ('hakkimizda', 'iletisim', 'koleksiyonlar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Politikaları
ALTER TABLE sayfalar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sayfaları herkes okuyabilir" ON sayfalar;
DROP POLICY IF EXISTS "Sadece yetkililer düzenleyebilir" ON sayfalar;
CREATE POLICY "Sayfaları herkes okuyabilir" ON sayfalar FOR SELECT USING (true);
CREATE POLICY "Sadece yetkililer düzenleyebilir" ON sayfalar FOR ALL USING (auth.role() = 'authenticated');

-- Örnek sayfa verileri
INSERT INTO sayfalar (baslik, icerik, resimUrl, tip) VALUES
('Hakkımızda', 'Fahika, 2023 yılında kurulan ve ev kokularında yeni bir soluk getirmeyi hedefleyen bir markadır. Doğadan ilham alan kokularımız, yaşam alanlarınıza huzur ve ferahlık katmak için özenle tasarlanmıştır.', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/landscapes/nature-mountains.jpg', 'hakkimizda'),
('İletişim', 'Bize ulaşmak için: info@fahika.com | Tel: +90 555 555 5555 | Adres: İstanbul, Türkiye', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/landscapes/architecture-signs.jpg', 'iletisim'),
('Koleksiyonlar', 'Özel tasarım koleksiyonlarımız, her biri benzersiz hikayelere sahip kokulardan oluşur. Her koleksiyon, farklı bir temayı ve duyguyu yansıtır.', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/accessories-bag.jpg', 'koleksiyonlar'); 