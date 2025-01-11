'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaUpload, FaHome, FaSignOutAlt, FaSearch, FaTimes, FaCheck, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Fotograf {
  url: string;
  sira: number;
}

interface Koku {
  id: string;
  isim: string;
  slug: string;
  fotograflar: Fotograf[];
  ana_fotograf: string;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

interface KokuFormData {
  id?: string;
  isim: string;
  fotograflar: Fotograf[];
  ana_fotograf: string | null;
  fiyat: number;
  aciklama: string;
  kategori: string;
  stok: number;
  koku_notlari: string;
  hacim: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [kokuData, setKokuData] = useState<KokuFormData>({
    isim: '',
    fotograflar: [],
    ana_fotograf: null,
    fiyat: 0,
    aciklama: '',
    kategori: '',
    stok: 0,
    koku_notlari: '',
    hacim: ''
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [fotografOnizleme, setFotografOnizleme] = useState<string[]>([]);
  const [yuklenenFotograflar, setYuklenenFotograflar] = useState<File[]>([]);
  const [seciliKokular, setSeciliKokular] = useState<string[]>([]);
  const [filtreAcik, setFiltreAcik] = useState(false);
  const [filtreler, setFiltreler] = useState({
    kategori: '',
    minFiyat: '',
    maxFiyat: '',
    minStok: '',
    maxStok: '',
    hacim: ''
  });

  useEffect(() => {
    const adminGiris = localStorage.getItem('adminGiris');
    if (!adminGiris) {
      router.push('/admin/login');
      return;
    }
    kokuGetir();
  }, []);

  const kokuGetir = async () => {
    try {
      setYukleniyor(true);
      const response = await fetch('http://localhost:5000/api/kokular');
      if (!response.ok) throw new Error('Kokular getirilemedi');
      const data = await response.json();
      setKokular(data);
    } catch (error) {
      console.error('Kokuları getirme hatası:', error);
      toast.error('Kokular yüklenirken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  const kokuSil = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/kokular/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Koku silinemedi');
      toast.success('Koku başarıyla silindi');
      kokuGetir();
    } catch (error) {
      console.error('Koku silme hatası:', error);
      toast.error('Koku silinirken bir hata oluştu');
    }
  };

  const fotograflariOnizle = (files: FileList) => {
    const yeniFotograflar = Array.from(files);
    setYuklenenFotograflar(prev => [...prev, ...yeniFotograflar]);
    
    yeniFotograflar.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotografOnizleme(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const fotografSil = (index: number) => {
    setFotografOnizleme(prev => prev.filter((_, i) => i !== index));
    setYuklenenFotograflar(prev => prev.filter((_, i) => i !== index));
    setKokuData(prev => ({
      ...prev,
      fotograflar: prev.fotograflar.filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const yeniFotograflar = [...kokuData.fotograflar];
    const [tasinanFoto] = yeniFotograflar.splice(dragIndex, 1);
    yeniFotograflar.splice(dropIndex, 0, tasinanFoto);

    const guncelFotograflar = yeniFotograflar.map((foto, index) => ({
      ...foto,
      sira: index
    }));

    setKokuData(prev => ({
      ...prev,
      fotograflar: guncelFotograflar,
      ana_fotograf: guncelFotograflar[0]?.url || null
    }));
  };

  const fotograflariYukle = async (files: File[]) => {
    const yuklenenUrller: Fotograf[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('upload_preset', 'ml_default');
        
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dqhheif0c/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          throw new Error('Fotoğraf yükleme başarısız');
        }
        
        const data = await response.json();
        if (data.secure_url) {
          yuklenenUrller.push({
            url: data.secure_url,
            sira: kokuData.fotograflar.length + i
          });
        }
      } catch (error) {
        console.error('Resim yüklenirken hata:', error);
        toast.error('Resim yüklenirken bir hata oluştu');
      }
    }
    
    return yuklenenUrller;
  };

  const kokuDuzenle = async () => {
    if (!kokuData.id) return;

    try {
      setYukleniyor(true);

      // Yeni fotoğrafları yükle
      let tumFotograflar = [...kokuData.fotograflar];
      if (yuklenenFotograflar.length > 0) {
        const yuklenenUrller = await fotograflariYukle(yuklenenFotograflar);
        tumFotograflar = [...tumFotograflar, ...yuklenenUrller];
      }

      // Fotoğrafları sırala
      tumFotograflar = tumFotograflar.map((foto, index) => ({
        url: foto.url,
        sira: index
      }));

      // Güncellenecek veriyi hazırla
      const guncelKoku = {
        isim: kokuData.isim,
        slug: kokuData.isim
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
        fiyat: Number(kokuData.fiyat),
        aciklama: kokuData.aciklama || '',
        kategori: kokuData.kategori,
        stok: Number(kokuData.stok),
        koku_notlari: kokuData.koku_notlari || '',
        hacim: kokuData.hacim || '',
        fotograflar: tumFotograflar,
        ana_fotograf: tumFotograflar[0]?.url || null
      };

      const response = await fetch(`http://localhost:5000/api/kokular/${kokuData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guncelKoku)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Koku güncellenemedi');
      }

      toast.success('Koku başarıyla güncellendi');
      await kokuGetir();
      formSifirla();
      setDuzenlemeModu(false);
    } catch (error) {
      console.error('Koku güncelleme hatası:', error);
      toast.error('Koku güncellenirken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  const kokuDuzenlemeyiBaslat = (koku: Koku) => {
    setKokuData({
      id: koku.id,
      isim: koku.isim || '',
      fotograflar: Array.isArray(koku.fotograflar) ? koku.fotograflar : [],
      ana_fotograf: koku.ana_fotograf || null,
      fiyat: Number(koku.fiyat) || 0,
      aciklama: koku.aciklama || '',
      kategori: koku.kategori || '',
      stok: Number(koku.stok) || 0,
      koku_notlari: koku.koku_notlari || '',
      hacim: koku.hacim || ''
    });
    setFotografOnizleme([]);
    setYuklenenFotograflar([]);
    setDuzenlemeModu(true);
  };

  const kokuKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setYukleniyor(true);

      if (kokuData.id) {
        await kokuDuzenle();
        return;
      }

      // Yeni koku ekleme
      const slug = kokuData.isim
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const yuklenenUrller = await fotograflariYukle(yuklenenFotograflar);
      
      const yeniKoku = {
        ...kokuData,
        slug,
        fotograflar: yuklenenUrller,
        ana_fotograf: yuklenenUrller[0]?.url || null
      };

      const response = await fetch('http://localhost:5000/api/kokular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(yeniKoku)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Koku eklenemedi');
      }

      toast.success('Koku başarıyla eklendi');
      formSifirla();
      kokuGetir();
    } catch (error) {
      console.error('Koku kaydetme hatası:', error);
      toast.error('Koku kaydedilirken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let yeniDeger = value;

    // Fiyat ve stok için sayısal değer kontrolü
    if (name === 'fiyat' || name === 'stok') {
      const sayisalDeger = parseFloat(value);
      if (!isNaN(sayisalDeger) && sayisalDeger >= 0) {
        yeniDeger = sayisalDeger.toString();
      } else {
        return; // Geçersiz değer girilirse güncelleme yapma
      }
    }

    setKokuData(prev => ({
      ...prev,
      [name]: yeniDeger
    }));
  };

  const formSifirla = () => {
    setKokuData({
      isim: '',
      fotograflar: [],
      ana_fotograf: null,
      fiyat: 0,
      aciklama: '',
      kategori: '',
      stok: 0,
      koku_notlari: '',
      hacim: ''
    });
    setFotografOnizleme([]);
    setYuklenenFotograflar([]);
    setDuzenlemeModu(false);
  };

  // Toplu seçim işlemleri
  const kokuSec = (id: string) => {
    if (seciliKokular.includes(id)) {
      setSeciliKokular(seciliKokular.filter(k => k !== id));
    } else {
      setSeciliKokular([...seciliKokular, id]);
    }
  };

  const tumunuSec = () => {
    if (seciliKokular.length === kokular.length) {
      setSeciliKokular([]);
    } else {
      setSeciliKokular(kokular.map(k => k.id));
    }
  };

  // Toplu silme işlemi
  const secilenleriSil = async () => {
    if (!window.confirm('Seçili kokuları silmek istediğinize emin misiniz?')) return;

    try {
      setYukleniyor(true);
      for (const id of seciliKokular) {
        await fetch(`http://localhost:5000/api/kokular/${id}`, {
          method: 'DELETE'
        });
      }
      toast.success('Seçili kokular başarıyla silindi');
      setSeciliKokular([]);
      kokuGetir();
    } catch (error) {
      toast.error('Kokular silinirken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  // Filtreleme işlemleri
  const filtreUygula = (yeniFiltreler = filtreler) => {
    let filtrelenmisKokular = [...kokular];

    if (aramaMetni) {
      filtrelenmisKokular = filtrelenmisKokular.filter(koku =>
        koku.isim.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        koku.koku_notlari.toLowerCase().includes(aramaMetni.toLowerCase())
      );
    }

    if (yeniFiltreler.kategori) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.kategori === yeniFiltreler.kategori);
    }
    if (yeniFiltreler.minFiyat) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.fiyat >= Number(yeniFiltreler.minFiyat));
    }
    if (yeniFiltreler.maxFiyat) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.fiyat <= Number(yeniFiltreler.maxFiyat));
    }
    if (yeniFiltreler.minStok) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.stok >= Number(yeniFiltreler.minStok));
    }
    if (yeniFiltreler.maxStok) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.stok <= Number(yeniFiltreler.maxStok));
    }
    if (yeniFiltreler.hacim) {
      filtrelenmisKokular = filtrelenmisKokular.filter(k => k.hacim === yeniFiltreler.hacim);
    }

    setKokular(filtrelenmisKokular);
  };

  // Filtre değişikliklerini izle
  useEffect(() => {
    filtreUygula(filtreler);
  }, [filtreler, aramaMetni]);

  const handleFiltreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const yeniFiltreler = { ...filtreler, [name]: value };
    setFiltreler(yeniFiltreler);
  };

  const filtreleriSifirla = () => {
    setFiltreler({
      kategori: '',
      minFiyat: '',
      maxFiyat: '',
      minStok: '',
      maxStok: '',
      hacim: ''
    });
    setAramaMetni('');
    kokuGetir();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Arama ve Yeni Koku */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Koku ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setFiltreAcik(!filtreAcik)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FaFilter /> Filtrele
            </button>
            {seciliKokular.length > 0 && (
              <button
                onClick={secilenleriSil}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FaTrash /> Seçilenleri Sil ({seciliKokular.length})
              </button>
            )}
          </div>
          <button
            onClick={() => setDuzenlemeModu(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Yeni Koku</span>
          </button>
        </div>

        {/* Filtre Paneli */}
        {filtreAcik && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-3 gap-4">
              <select
                name="kategori"
                value={filtreler.kategori}
                onChange={handleFiltreChange}
                className="p-2 rounded border"
              >
                <option value="">Kategori Seçin</option>
                <option value="parfum">Parfüm</option>
                <option value="oda-kokusu">Oda Kokusu</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minFiyat"
                  placeholder="Min Fiyat"
                  value={filtreler.minFiyat}
                  onChange={handleFiltreChange}
                  className="p-2 rounded border w-full"
                />
                <input
                  type="number"
                  name="maxFiyat"
                  placeholder="Max Fiyat"
                  value={filtreler.maxFiyat}
                  onChange={handleFiltreChange}
                  className="p-2 rounded border w-full"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minStok"
                  placeholder="Min Stok"
                  value={filtreler.minStok}
                  onChange={handleFiltreChange}
                  className="p-2 rounded border w-full"
                />
                <input
                  type="number"
                  name="maxStok"
                  placeholder="Max Stok"
                  value={filtreler.maxStok}
                  onChange={handleFiltreChange}
                  className="p-2 rounded border w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={filtreleriSifirla}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}

        {/* Koku Düzenleme Formu */}
        {duzenlemeModu && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <form onSubmit={kokuKaydet} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">
                  {kokuData.id ? 'Koku Düzenle' : 'Yeni Koku'}
                </h2>
                <button
                  type="button"
                  onClick={formSifirla}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koku Adı
                  </label>
                  <input
                    type="text"
                    name="isim"
                    value={kokuData.isim}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    name="fiyat"
                    value={kokuData.fiyat}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={kokuData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    <option value="parfum">Parfüm</option>
                    <option value="oda">Oda Kokusu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={kokuData.stok}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hacim (ml)
                  </label>
                  <input
                    type="text"
                    name="hacim"
                    value={kokuData.hacim}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koku Notaları (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    name="koku_notlari"
                    value={kokuData.koku_notlari}
                    onChange={handleInputChange}
                    placeholder="Örnek: Lavanta, Vanilya, Misk"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="aciklama"
                  value={kokuData.aciklama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800"
                  rows={4}
                  required
                />
              </div>

              {/* Fotoğraf yükleme ve sıralama */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fotoğraflar
                </label>
                
                <div className="flex flex-wrap gap-4">
                  {[...kokuData.fotograflar, ...fotografOnizleme.map((url, index) => ({
                    url,
                    sira: kokuData.fotograflar.length + index
                  }))].map((foto, index) => (
                    <div
                      key={`${foto.url}-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="relative w-32 h-32 group cursor-move"
                    >
                      <Image
                        src={foto.url}
                        alt={`Fotoğraf ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg">
                        <button
                          type="button"
                          onClick={() => fotografSil(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <FaTimes size={12} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                            Ana Fotoğraf
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && fotograflariOnizle(e.target.files)}
                      className="hidden"
                    />
                    <FaPlus className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Fotoğraf Ekle</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={formSifirla}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className={`px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 ${
                    yukleniyor ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {yukleniyor ? 'Kaydediliyor...' : kokuData.id ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Koku Listesi */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={seciliKokular.length === kokular.length}
                    onChange={tumunuSec}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kokular
                .filter(koku =>
                  koku.isim.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                  koku.kategori.toLowerCase().includes(aramaMetni.toLowerCase())
                )
                .map((koku) => (
                  <tr key={koku.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={seciliKokular.includes(koku.id)}
                        onChange={() => kokuSec(koku.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={koku.ana_fotograf || '/placeholder.jpg'}
                            alt={koku.isim}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {koku.isim}
                          </div>
                          <div className="text-sm text-gray-500">
                            {koku.hacim} ml
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {koku.kategori === 'parfum' ? 'Parfüm' : 'Oda Kokusu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {koku.fiyat} TL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {koku.stok}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => kokuDuzenlemeyiBaslat(koku)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Bu kokuyu silmek istediğinizden emin misiniz?')) {
                            kokuSil(koku.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 