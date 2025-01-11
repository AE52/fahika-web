-- Önce mevcut tabloyu sil
DROP TABLE IF EXISTS urunler CASCADE;

-- Tabloyu yeniden oluştur
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Politikaları
ALTER TABLE urunler ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ürünleri herkes okuyabilir" ON urunler;
DROP POLICY IF EXISTS "Sadece yetkililer düzenleyebilir" ON urunler;

CREATE POLICY "Ürünleri herkes okuyabilir" ON urunler
    FOR SELECT USING (true);

CREATE POLICY "Sadece yetkililer düzenleyebilir" ON urunler
    FOR ALL USING (auth.role() = 'authenticated');

-- Örnek ürünleri ekle
INSERT INTO urunler (isim, resimUrl, fiyat, aciklama, kategori, stok, notlar, hacim) VALUES
('Lavanta Rüyası', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-1.jpg', 1250, 'Lavanta ve vanilya notalarının büyüleyici uyumu.', 'Çiçeksi', 50, ARRAY['Lavanta', 'Vanilya', 'Paçuli'], 100),
('Oryantal Gece', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-2.jpg', 1500, 'Doğu''nun gizemli baharatları.', 'Oryantal', 30, ARRAY['Amber', 'Sandal Ağacı', 'Baharat'], 100),
('Akdeniz Esintisi', 'https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/perfume-3.jpg', 1350, 'Narenciye ve deniz notaları.', 'Ferah', 45, ARRAY['Bergamot', 'Limon', 'Deniz Tuzu'], 100);

-- Şema önbelleğini yenile
NOTIFY pgrst, 'reload schema'; 