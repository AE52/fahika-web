"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SortableFoto } from './components/SortableFoto';

interface Fotograf {
  url: string;
  sira: number;
}

interface Koku {
  id: string;
  isim: string;
  slug: string;
  aciklama: string;
  fiyat: number;
  stok: number;
  kategori: string;
  hacim: string;
  koku_notlari: string;
  fotograflar: Fotograf[];
  ana_fotograf: string;
}

// URL'deki hataları temizleyen yardımcı fonksiyon
const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  // URL'nin sonundaki sayıları ve gereksiz karakterleri temizle
  return url.replace(/[0-9]+$/, '').replace(/\.[^/.]+$/, '.jpg');
};

export default function AdminPage() {
  // State hooks
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [seciliKokular, setSeciliKokular] = useState<string[]>([]);
  const [duzenlemeModu, setDuzenlemeModu] = useState<'yeni' | 'duzenle' | null>(null);
  const [seciliKoku, setSeciliKoku] = useState<Koku | null>(null);
  const [filtreKelime, setFiltreKelime] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const router = useRouter();

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtered kokular with useMemo
  const filtrelenmisKokular = useMemo(() => {
    if (!Array.isArray(kokular)) return [];
    return kokular.filter(koku => 
      (koku?.isim?.toLowerCase() || '').includes(filtreKelime.toLowerCase()) ||
      (koku?.kategori?.toLowerCase() || '').includes(filtreKelime.toLowerCase())
    );
  }, [kokular, filtreKelime]);

  // Kokuları getir
  const kokulariGetir = async () => {
    try {
      setYukleniyor(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kokular`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setKokular(data);
      } else {
        console.error('Geçersiz veri formatı:', data);
        toast.error('Kokular getirilirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Kokular getirilirken hata:', error);
      toast.error('Kokular getirilirken bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    kokulariGetir();
  }, [router]);

  // Token kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [router]);

  // Koku seçimi
  const kokuSec = (kokuId: string) => {
    if (seciliKokular.includes(kokuId)) {
      setSeciliKokular(seciliKokular.filter(id => id !== kokuId));
    } else {
      setSeciliKokular([...seciliKokular, kokuId]);
    }
  };

  // Toplu seçim
  const tumunuSec = () => {
    if (seciliKokular.length === kokular.length) {
      setSeciliKokular([]);
    } else {
      setSeciliKokular(kokular.map(koku => koku.id));
    }
  };

  // Toplu silme
  const secilenleriSil = async () => {
    if (!window.confirm('Seçili kokuları silmek istediğinize emin misiniz?')) return;

    try {
      for (const kokuId of seciliKokular) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Koku silinemedi: ${kokuId}`);
      }
      
      setKokular(kokular.filter(koku => !seciliKokular.includes(koku.id)));
      setSeciliKokular([]);
      toast.success('Seçili kokular başarıyla silindi');
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Kokular silinirken bir hata oluştu');
    }
  };

  // Koku düzenleme
  const kokuDuzenle = (koku: Koku) => {
    // Fotoğrafları kontrol et ve düzenle
    const duzenliFotograflar = (koku.fotograflar || [])
      .filter(foto => foto && foto.url && foto.url.trim() !== '')
      .map((foto, index) => ({
        url: cleanImageUrl(foto.url.trim()),
        sira: index
      }));

    // Ana fotoğrafı kontrol et ve temizle
    const anaFotograf = cleanImageUrl(koku.ana_fotograf?.trim() || duzenliFotograflar[0]?.url || '');

    const siraliKoku = {
      ...koku,
      fotograflar: duzenliFotograflar,
      ana_fotograf: anaFotograf
    };

    console.log('Düzenlenen koku:', siraliKoku);
    setSeciliKoku(siraliKoku);
    setDuzenlemeModu('duzenle');
  };

  // Koku kaydetme
  const kokuKaydet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!seciliKoku) return;

    try {
      // Slug oluştur
      const slug = seciliKoku.isim
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

      const kokuData = {
        ...seciliKoku,
        slug: `${slug}-${seciliKoku.hacim.toLowerCase().replace(/\s+/g, '')}`
      };

      const method = duzenlemeModu === 'yeni' ? 'POST' : 'PUT';
      const url = duzenlemeModu === 'yeni' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/kokular`
        : `${process.env.NEXT_PUBLIC_API_URL}/kokular/${seciliKoku.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kokuData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Koku kaydetme hatası:', errorText);
        throw new Error(duzenlemeModu === 'yeni' ? 'Koku eklenirken bir hata oluştu' : 'Koku güncellenirken bir hata oluştu');
      }

      const savedKoku = await response.json();
      
      setKokular(prevKokular => {
        if (duzenlemeModu === 'yeni') {
          return [...prevKokular, savedKoku];
        } else {
          return prevKokular.map(k => k.id === savedKoku.id ? savedKoku : k);
        }
      });

      toast.success(duzenlemeModu === 'yeni' ? 'Koku başarıyla eklendi' : 'Koku başarıyla güncellendi');
      setDuzenlemeModu(null);
      setSeciliKoku(null);
    } catch (error) {
      console.error('Koku kaydetme hatası:', error);
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  // Fotoğraf yükleme
  const fotografYukle = async (dosya: File) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return null;
      }

      const formData = new FormData();
      formData.append('file', dosya);
      formData.append('folder', 'kokular');

      const response = await fetch('http://localhost:8080/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fotoğraf yükleme hatası:', errorText);
        throw new Error('Fotoğraf yüklenemedi');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      throw error;
    }
  };

  // Fotoğraf silme
  const fotografSil = async (url: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return;
      }

      if (!seciliKoku) {
        toast.error('Lütfen önce bir koku seçin');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/admin/kokular/${seciliKoku.id}/fotograflar`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fotoğraf silinirken bir hata oluştu');
      }

      const yeniFotograflar = seciliKoku.fotograflar.filter(f => f.url !== url);
      let yeniAnaFotograf = seciliKoku.ana_fotograf;
      if (url === seciliKoku.ana_fotograf) {
        yeniAnaFotograf = yeniFotograflar.length > 0 ? yeniFotograflar[0].url : '';
      }

      const yeniKoku: Koku = {
        ...seciliKoku,
        fotograflar: yeniFotograflar,
        ana_fotograf: yeniAnaFotograf
      };

      setSeciliKoku(yeniKoku);
      toast.success('Fotoğraf başarıyla silindi');
    } catch (error) {
      console.error('Fotoğraf silme hatası:', error);
      toast.error(error instanceof Error ? error.message : 'Fotoğraf silinirken bir hata oluştu');
    }
  };

  // Fotoğraf sırasını güncelle
  const fotografSiralamaGuncelle = async (kokuId: string, yeniFotograflar: Fotograf[]) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return;
      }

      // Fotoğrafları temizle ve sırala
      const temizFotograflar = yeniFotograflar.map((foto, index) => ({
        url: cleanImageUrl(foto.url),
        sira: index
      }));

      // Koku bilgilerini güncelle
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kokular/${kokuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fotograflar: temizFotograflar
        })
      });

      if (!response.ok) {
        throw new Error('Fotoğraf sırası güncellenemedi');
      }

      return await response.json();
    } catch (error) {
      console.error('Sıralama güncelleme hatası:', error);
      throw error;
    }
  };

  // Ana fotoğraf seçimi için yeni fonksiyon ekle
  const anaFotografSec = async (kokuId: string, fotoUrl: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}/ana-fotograf`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ana_fotograf: fotoUrl }),
      });

      if (!response.ok) {
        throw new Error('Ana fotoğraf seçilirken bir hata oluştu');
      }

      const data = await response.json();
      setKokular(prevKokular =>
        prevKokular.map(koku =>
          koku.id === kokuId ? { ...koku, ana_fotograf: data.ana_fotograf } : koku
        )
      );
      toast.success('Ana fotoğraf güncellendi');
    } catch (error) {
      console.error('Ana fotoğraf seçme hatası:', error);
      toast.error('Ana fotoğraf seçilirken bir hata oluştu');
    }
  };

  // Yeni koku oluşturma
  const yeniKokuOlustur = () => {
    setSeciliKoku({
      id: '',
      isim: '',
      slug: '',
      aciklama: '',
      fiyat: 0,
      stok: 0,
      kategori: 'cubuklu_oda_kokusu',
      hacim: '',
      koku_notlari: '',
      fotograflar: [],
      ana_fotograf: ''
    });
    setDuzenlemeModu('yeni');
  };

  const handleJsonImport = async () => {
    try {
      const products = JSON.parse(jsonInput);
      
      for (const product of products) {
        const response = await fetch('http://localhost:8080/api/kokular', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error(`${product.isim} eklenirken hata oluştu`);
        }
      }

      toast.success('Ürünler başarıyla eklendi');
      setJsonInput('');
      
      // Listeyi yenile
      const token = localStorage.getItem('adminToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/admin/kokular', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.kokular && Array.isArray(data.kokular)) {
            setKokular(data.kokular);
          }
        }
      }
    } catch (error) {
      toast.error('JSON formatı hatalı veya ürünler eklenemedi');
      console.error('Hata:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !seciliKoku) return;

    try {
      // URL'leri temizle
      const activeUrl = cleanImageUrl(active.id.toString());
      const overUrl = cleanImageUrl(over.id.toString());

      const oldIndex = seciliKoku.fotograflar.findIndex(f => cleanImageUrl(f.url) === activeUrl);
      const newIndex = seciliKoku.fotograflar.findIndex(f => cleanImageUrl(f.url) === overUrl);

      if (oldIndex === -1 || newIndex === -1) return;

      // Yeni sıralamayı oluştur
      const yeniFotograflar = arrayMove(seciliKoku.fotograflar, oldIndex, newIndex)
        .map((foto, index) => ({
          url: cleanImageUrl(foto.url),
          sira: index
        }));

      // Önce state'i güncelle
      setSeciliKoku({
        ...seciliKoku,
        fotograflar: yeniFotograflar
      });

      // Sonra sunucuya gönder
      await fotografSiralamaGuncelle(seciliKoku.id, yeniFotograflar);
      toast.success('Fotoğraf sırası güncellendi');

    } catch (error) {
      console.error('Sıralama güncelleme hatası:', error);
      toast.error('Fotoğraf sırası güncellenirken bir hata oluştu');
    }
  };

  const handleFotoEkle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !seciliKoku) {
      toast.error('Lütfen bir fotoğraf seçin ve bir koku seçili olduğundan emin olun');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hata yanıtı:', errorText);
        throw new Error('Fotoğraf yükleme başarısız');
      }

      const data = await response.json();
      
      if (!data || !data.url) {
        throw new Error('Sunucudan geçersiz yanıt alındı');
      }

      // URL'yi temizle
      const temizUrl = cleanImageUrl(data.url);

      // Mevcut fotoğrafları kontrol et ve filtrele
      const mevcutFotograflar = seciliKoku.fotograflar?.filter(foto => foto && foto.url) || [];
      
      // Yeni fotoğrafı ekle
      const yeniFotograflar = [
        ...mevcutFotograflar,
        { url: temizUrl, sira: mevcutFotograflar.length }
      ];

      // Ana fotoğraf yoksa, yeni fotoğrafı ana fotoğraf olarak ayarla
      const yeniKoku = {
        ...seciliKoku,
        fotograflar: yeniFotograflar,
        ana_fotograf: seciliKoku.ana_fotograf || temizUrl
      };

      setSeciliKoku(yeniKoku);
      toast.success('Fotoğraf başarıyla yüklendi');

      // Fotoğrafları sunucuda güncelle
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kokular/${seciliKoku.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(yeniKoku)
      });

      if (!updateResponse.ok) {
        throw new Error('Fotoğraf bilgileri güncellenemedi');
      }

    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      toast.error(error instanceof Error ? error.message : 'Fotoğraf yüklenirken bir hata oluştu');
    }
  };

  const handleFotoSil = async (url: string) => {
    if (!seciliKoku) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return;
      }

      // URL'yi temizle
      const temizUrl = cleanImageUrl(url);

      // Fotoğrafı listeden kaldır
      const yeniFotograflar = seciliKoku.fotograflar
        .filter(f => cleanImageUrl(f.url) !== temizUrl)
        .map((foto, index) => ({
          url: cleanImageUrl(foto.url),
          sira: index
        }));

      // Ana fotoğraf siliniyorsa, yeni ana fotoğraf seç
      let yeniAnaFotograf = cleanImageUrl(seciliKoku.ana_fotograf);
      if (temizUrl === yeniAnaFotograf) {
        yeniAnaFotograf = yeniFotograflar[0]?.url || '';
      }

      // Koku bilgilerini güncelle
      const yeniKoku = {
        ...seciliKoku,
        fotograflar: yeniFotograflar,
        ana_fotograf: yeniAnaFotograf
      };

      // Sunucuya güncelleme isteği gönder
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kokular/${seciliKoku.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(yeniKoku)
      });

      if (!response.ok) {
        throw new Error('Fotoğraf silinemedi');
      }

      setSeciliKoku(yeniKoku);
      toast.success('Fotoğraf başarıyla silindi');

    } catch (error) {
      console.error('Fotoğraf silme hatası:', error);
      toast.error(error instanceof Error ? error.message : 'Fotoğraf silinirken bir hata oluştu');
    }
  };

  // Kaydetme fonksiyonu
  const handleKaydet = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        router.push('/admin/login');
        return;
      }

      if (!seciliKoku) {
        toast.error('Koku seçilmedi');
        return;
      }

      // Kategori değerini doğrudan kullan
      const kokuData = {
        isim: seciliKoku.isim,
        aciklama: seciliKoku.aciklama,
        fiyat: seciliKoku.fiyat,
        kategori: seciliKoku.kategori,
        fotograflar: seciliKoku.fotograflar,
        ana_fotograf: seciliKoku.ana_fotograf,
        hacim: seciliKoku.hacim,
        stok: seciliKoku.stok,
        slug: seciliKoku.isim
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      };

      console.log('Gönderilen veri:', kokuData);

      const url = duzenlemeModu === 'duzenle'
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/kokular/${seciliKoku.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/kokular`;

      const response = await fetch(url, {
        method: duzenlemeModu === 'duzenle' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(kokuData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Kaydetme hatası:', errorText);
        throw new Error('Koku kaydedilemedi');
      }

      const data = await response.json();
      console.log('Kayıt cevabı:', data);

      toast.success(duzenlemeModu === 'duzenle' ? 'Koku güncellendi' : 'Yeni koku eklendi');
      setDuzenlemeModu(null);
      setSeciliKoku(null);
      kokulariGetir();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Koku kaydedilirken bir hata oluştu');
    }
  };

  useEffect(() => {
    const fetchKokular = async () => {
      try {
        setYukleniyor(true);
        const response = await fetch('/api/kokular');
        if (!response.ok) {
          throw new Error('Kokular yüklenemedi');
        }
        const data = await response.json();
        setKokular(data);
      } catch (error) {
        console.error('Kokular yüklenirken hata:', error);
        toast.error('Kokular yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    };

    fetchKokular();
  }, []);

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('storage')); // storage event'ını tetikle
    router.push('/admin/login');
    toast.success('Çıkış yapıldı');
  };

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center space-x-2 text-sm"
          >
            <span>←</span>
            <span>Anasayfaya Dön</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Çıkış Yap
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Koku ara..."
            value={filtreKelime}
            onChange={(e) => setFiltreKelime(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black flex-grow lg:flex-grow-0"
          />
          <button
            onClick={tumunuSec}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm whitespace-nowrap"
          >
            {seciliKokular.length === kokular.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
          </button>
          {seciliKokular.length > 0 && (
            <button
              onClick={secilenleriSil}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm whitespace-nowrap"
            >
              Seçilenleri Sil ({seciliKokular.length})
            </button>
          )}
          <button
            onClick={yeniKokuOlustur}
            className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-sm whitespace-nowrap"
          >
            Yeni Koku Ekle
          </button>
        </div>
      </div>

      {/* Kokular Tablosu */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={seciliKokular.length === kokular.length}
                    onChange={tumunuSec}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fotoğraf
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İsim
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Kategori
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Fiyat
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Stok
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrelenmisKokular.map((koku) => (
                <tr key={koku.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={seciliKokular.includes(koku.id)}
                      onChange={() => kokuSec(koku.id)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                      <Image
                        src={koku.ana_fotograf || '/images/placeholder.jpg'}
                        alt={koku.isim}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 48px, 64px"
                        unoptimized={koku.ana_fotograf?.includes('cloudinary')}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{koku.isim}</div>
                    <div className="text-xs text-gray-500">{koku.hacim}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {koku.kategori}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {(koku.fiyat || 0).toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      koku.stok > 5 ? 'bg-green-100 text-green-800' : 
                      koku.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {koku.stok}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => kokuDuzenle(koku)}
                      className="text-black hover:text-gray-900"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => fotografSil(koku.ana_fotograf)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme/Ekleme Modalı */}
      {duzenlemeModu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              {duzenlemeModu === 'yeni' ? 'Yeni Koku Ekle' : 'Koku Düzenle'}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={seciliKoku?.isim || ''}
                    onChange={(e) => setSeciliKoku(prev => prev && { ...prev, isim: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={seciliKoku?.aciklama || ''}
                    onChange={(e) => setSeciliKoku(prev => prev && { ...prev, aciklama: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={seciliKoku?.kategori || ''}
                      onChange={(e) => setSeciliKoku(prev => prev && { ...prev, kategori: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="cubuklu_oda_kokusu">Çubuklu Oda Kokusu</option>
                      <option value="vucut_spreyi">Vücut Spreyi</option>
                      <option value="araba_kokusu">Araba Kokusu</option>
                      <option value="parfum">Parfüm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiyat
                    </label>
                    <input
                      type="number"
                      value={seciliKoku?.fiyat || ''}
                      onChange={(e) => setSeciliKoku(prev => prev && { ...prev, fiyat: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotoğraflar
                </label>
                <div className="border rounded-lg p-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={seciliKoku?.fotograflar?.map(f => f.url) || []}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {seciliKoku?.fotograflar?.map((foto, index) => (
                          <SortableFoto
                            key={`${foto.url}-${index}`}
                            foto={foto}
                            index={index}
                            kokuIsim={seciliKoku.isim}
                            onSil={() => handleFotoSil(foto.url)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoEkle}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDuzenlemeModu(null);
                  setSeciliKoku(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={handleKaydet}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON ile Ürün Ekleme */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">JSON ile Ürün Ekle</h2>
        <div className="space-y-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Ürün verilerini JSON formatında yapıştırın..."
            className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
          />
          <button
            onClick={handleJsonImport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            JSON'dan Ürünleri Ekle
          </button>
        </div>
      </div>
    </div>
  );
} 