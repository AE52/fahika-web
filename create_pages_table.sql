CREATE TABLE sayfalar (id SERIAL PRIMARY KEY, baslik TEXT NOT NULL, icerik TEXT NOT NULL, resimUrl TEXT NOT NULL, tip TEXT NOT NULL CHECK (tip IN ('hakkimizda', 'iletisim', 'koleksiyonlar')), created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL); ALTER TABLE sayfalar ENABLE ROW LEVEL SECURITY; CREATE POLICY \
Sayfaları
herkes
okuyabilir\ ON sayfalar FOR SELECT USING (true); CREATE POLICY \Sadece
yetkililer
düzenleyebilir\ ON sayfalar FOR ALL USING (auth.role() = 'authenticated');
