-- Önce mevcut tabloları temizle
DROP TABLE IF EXISTS urun_fotograflari CASCADE;
DROP TABLE IF EXISTS urunler CASCADE;
DROP TABLE IF EXISTS koku_notlari CASCADE;
DROP FUNCTION IF EXISTS slugify CASCADE;
DROP FUNCTION IF EXISTS set_updated_at CASCADE;

-- Updated_at için trigger fonksiyonu
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Slug oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION slugify(text)
RETURNS text AS $$
  SELECT lower(regexp_replace(regexp_replace($1, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
$$ LANGUAGE SQL STRICT IMMUTABLE;

-- Koku notları tablosu
CREATE TABLE koku_notlari (
  id BIGSERIAL PRIMARY KEY,
  isim TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler tablosu
CREATE TABLE urunler (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  isim TEXT NOT NULL,
  fotograflar JSONB DEFAULT '[]'::jsonb, -- [{"url": "...", "sira": 1}]
  ana_fotograf TEXT,
  fiyat INTEGER NOT NULL,
  aciklama TEXT,
  kategori TEXT NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  koku_notlari INTEGER[] DEFAULT '{}', -- koku_notlari tablosundaki ID'ler
  hacim TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_fotograflar CHECK (
    jsonb_typeof(fotograflar) = 'array' AND
    jsonb_array_length(fotograflar) >= 0
  )
);

-- Updated_at trigger'ları
CREATE TRIGGER set_urunler_updated_at
  BEFORE UPDATE ON urunler
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_koku_notlari_updated_at
  BEFORE UPDATE ON koku_notlari
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Slug trigger'ı
CREATE OR REPLACE FUNCTION set_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := slugify(NEW.isim);
    
    -- Eğer aynı slug varsa sonuna sayı ekle
    WHILE EXISTS(SELECT 1 FROM urunler WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_urunler_slug
  BEFORE INSERT OR UPDATE ON urunler
  FOR EACH ROW
  EXECUTE FUNCTION set_slug();

-- Ana fotoğraf güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_ana_fotograf()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer fotograflar array'i boş değilse ve ana_fotograf NULL ise
  -- ilk fotoğrafı ana_fotograf olarak ayarla
  IF NEW.fotograflar != '[]'::jsonb AND NEW.ana_fotograf IS NULL THEN
    NEW.ana_fotograf := (NEW.fotograflar->0->>'url')::text;
  END IF;
  
  -- Eğer fotograflar array'i boşsa ana_fotograf'ı NULL yap
  IF NEW.fotograflar = '[]'::jsonb THEN
    NEW.ana_fotograf := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ana_fotograf_trigger
  BEFORE INSERT OR UPDATE ON urunler
  FOR EACH ROW
  EXECUTE FUNCTION update_ana_fotograf();

-- RLS politikaları
ALTER TABLE urunler ENABLE ROW LEVEL SECURITY;
ALTER TABLE koku_notlari ENABLE ROW LEVEL SECURITY;

-- Ürünler için politikalar
DROP POLICY IF EXISTS "Herkes okuyabilir" ON urunler;
DROP POLICY IF EXISTS "Herkes ekleyebilir" ON urunler;
DROP POLICY IF EXISTS "Herkes düzenleyebilir" ON urunler;
DROP POLICY IF EXISTS "Herkes silebilir" ON urunler;

CREATE POLICY "Herkes okuyabilir" ON urunler
  FOR SELECT USING (true);

CREATE POLICY "Herkes ekleyebilir" ON urunler
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Herkes düzenleyebilir" ON urunler
  FOR UPDATE USING (true);

CREATE POLICY "Herkes silebilir" ON urunler
  FOR DELETE USING (true);

-- Koku notları için politikalar
CREATE POLICY "Herkes koku notlarını okuyabilir" ON koku_notlari
  FOR SELECT USING (true);

CREATE POLICY "Herkes koku notu ekleyebilir" ON koku_notlari
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Herkes koku notlarını düzenleyebilir" ON koku_notlari
  FOR UPDATE USING (true);

CREATE POLICY "Herkes koku notlarını silebilir" ON koku_notlari
  FOR DELETE USING (true);

-- Örnek koku notları
INSERT INTO koku_notlari (isim) VALUES 
('Lavanta'),
('Vanilya'),
('Misk'),
('Sandal Ağacı'),
('Amber'),
('Bergamot'),
('Limon'),
('Deniz Tuzu'),
('Gül'),
('Yasemin'),
('Portakal Çiçeği'),
('Paçuli'),
('Sedir Ağacı'),
('Mandalina'),
('Karabiber'),
('Tarçın'); 