-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('resimler', 'resimler', true);

-- Storage politikaları
CREATE POLICY "Herkes görebilir"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resimler' );

CREATE POLICY "Yetkililer yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'resimler' AND auth.role() = 'authenticated' );

CREATE POLICY "Yetkililer güncelleyebilir"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'resimler' AND auth.role() = 'authenticated' );

CREATE POLICY "Yetkililer silebilir"
ON storage.objects FOR DELETE
USING ( bucket_id = 'resimler' AND auth.role() = 'authenticated' ); 