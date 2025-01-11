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
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  created_at: string;
}

// Sürüklenebilir fotoğraf bileşeni
function SortableFoto({ foto, index, kokuIsim, onSil }: {
  foto: Fotograf;
  index: number;
  kokuIsim: string;
  onSil: (url: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: foto.url,
    data: {
      index,
      url: foto.url
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    touchAction: 'none',
    width: '100%',
    aspectRatio: '1/1',
    position: 'relative' as const
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-gray-100 rounded-lg overflow-hidden"
    >
      <div className="w-full h-full relative">
        {foto.url && (
          <Image
            src={foto.url}
            alt={`${kokuIsim} - Fotoğraf ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            priority={index === 0}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => onSil(foto.url)}
            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transform hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  // State hooks
  const [kokular, setKokular] = useState<Koku[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [seciliKokular, setSeciliKokular] = useState<string[]>([]);
  const [duzenlemeModu, setDuzenlemeModu] = useState<string | null>(null);
  const [seciliKoku, setSeciliKoku] = useState<Koku | null>(null);
  const [filtreKelime, setFiltreKelime] = useState('');

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtered kokular with useMemo
  const filtrelenmisKokular = useMemo(() => 
    kokular.filter(koku => 
      (koku.isim?.toLowerCase() || '').includes(filtreKelime.toLowerCase()) ||
      (koku.kategori?.toLowerCase() || '').includes(filtreKelime.toLowerCase())
    ),
    [kokular, filtreKelime]
  );

  // Effect hook
  useEffect(() => {
    const kokulariGetir = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular`);
        if (!response.ok) throw new Error('Kokular getirilemedi');
        const data = await response.json();
        setKokular(data.kokular);
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Kokular yüklenirken bir hata oluştu');
      } finally {
        setYukleniyor(false);
      }
    };

    kokulariGetir();
  }, []);

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
    setSeciliKoku(koku);
    setDuzenlemeModu('duzenle');
  };

  // Koku güncelleme
  const kokuGuncelle = async (id: string, yeniVeriler: Partial<Koku>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yeniVeriler),
      });

      if (!response.ok) {
        throw new Error('Koku güncellenirken bir hata oluştu');
      }

      const data = await response.json();
      setKokular(prevKokular => 
        prevKokular.map(koku => 
          koku.id === id ? { ...koku, ...data.koku } : koku
        )
      );
      toast.success('Koku başarıyla güncellendi');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Koku güncellenirken bir hata oluştu');
    }
  };

  // Fotoğraf sırası değiştirme
  const fotografSirasiDegistir = async (kokuId: string, fotografIndex: number, yeniSira: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}/fotograf-sirasi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fotografIndex, yeniSira }),
      });

      if (!response.ok) {
        throw new Error('Fotoğraf sırası değiştirilirken bir hata oluştu');
      }

      const data = await response.json();
      setKokular(prevKokular =>
        prevKokular.map(koku =>
          koku.id === kokuId ? { ...koku, fotograflar: data.fotograflar } : koku
        )
      );
      toast.success('Fotoğraf sırası güncellendi');
    } catch (error) {
      console.error('Sıra değiştirme hatası:', error);
      toast.error('Fotoğraf sırası değiştirilirken bir hata oluştu');
    }
  };

  // Fotoğraf yükleme
  const fotografYukle = async (kokuId: string, dosya: File) => {
    try {
      const formData = new FormData();
      formData.append('file', dosya);
      formData.append('folder', 'kokular');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const hataMetni = await response.text();
        throw new Error(`Fotoğraf yüklenemedi: ${hataMetni}`);
      }

      const data = await response.json();
      const koku = kokular.find(k => k.id === kokuId);
      if (!koku) {
        throw new Error('Koku bulunamadı');
      }

      const yeniFotograf = {
        url: data.url,
        sira: koku.fotograflar.length + 1
      };

      const yeniFotograflar = [...koku.fotograflar, yeniFotograf];
      const yeniKoku = { 
        ...koku, 
        fotograflar: yeniFotograflar,
        ana_fotograf: yeniFotograflar[0]?.url || koku.ana_fotograf 
      };

      const guncelleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(yeniKoku)
      });

      if (!guncelleResponse.ok) {
        throw new Error('Koku güncellenemedi');
      }

      const guncelKoku = await guncelleResponse.json();
      setKokular(prevKokular => prevKokular.map(k => k.id === kokuId ? guncelKoku : k));
      if (seciliKoku?.id === kokuId) {
        setSeciliKoku(guncelKoku);
      }
      toast.success('Fotoğraf başarıyla yüklendi');
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      toast.error('Fotoğraf yüklenirken bir hata oluştu: ' + (error as Error).message);
    }
  };

  // Fotoğraf silme
  const fotografSil = async (kokuId: string, fotografUrl: string) => {
    try {
      const koku = kokular.find(k => k.id === kokuId);
      if (!koku) return;

      const yeniFotograflar = koku.fotograflar.filter(foto => foto.url !== fotografUrl);
      const yeniKoku = { ...koku, fotograflar: yeniFotograflar };

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(yeniKoku)
      });

      setKokular(kokular.map(k => k.id === kokuId ? yeniKoku : k));
      toast.success('Fotoğraf başarıyla silindi');
    } catch (error) {
      console.error('Fotoğraf silme hatası:', error);
      toast.error('Fotoğraf silinirken bir hata oluştu');
    }
  };

  // Fotoğraf sırasını güncelle
  const fotografSiralamaGuncelle = async (kokuId: string, fotograflar: Fotograf[]) => {
    try {
      const koku = kokular.find(k => k.id === kokuId);
      if (!koku) return false;

      // İlk fotoğrafı ana fotoğraf olarak ayarla
      const yeniKoku = { 
        ...koku, 
        fotograflar,
        ana_fotograf: fotograflar[0]?.url || '' 
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kokular/${kokuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(yeniKoku)
      });

      if (!response.ok) {
        const hataMetni = await response.text();
        throw new Error(`Sıralama güncellenemedi: ${hataMetni}`);
      }

      const guncelKoku = await response.json();
      setKokular(prevKokular => prevKokular.map(k => k.id === kokuId ? guncelKoku : k));
      if (seciliKoku?.id === kokuId) {
        setSeciliKoku(guncelKoku);
      }

      return true;
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

  // Yeni koku oluşturma fonksiyonu
  const yeniKokuOlustur = () => {
    const yeniKoku: Koku = {
      id: '',
      isim: '',
      slug: '',
      fotograflar: [],
      ana_fotograf: '',
      fiyat: 0,
      aciklama: '',
      kategori: 'parfum',
      stok: 0,
      koku_notlari: '',
      hacim: '',
      created_at: new Date().toISOString()
    };
    setSeciliKoku(yeniKoku);
    setDuzenlemeModu('yeni');
  };

  // Koku kaydetme fonksiyonu
  const kokuKaydet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!seciliKoku) return;

    try {
      const method = duzenlemeModu === 'yeni' ? 'POST' : 'PUT';
      const endpoint = duzenlemeModu === 'yeni' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/kokular`
        : `${process.env.NEXT_PUBLIC_API_URL}/kokular/${seciliKoku.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...seciliKoku,
          slug: seciliKoku.isim.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        })
      });

      if (!response.ok) {
        const hataMetni = await response.text();
        throw new Error(`Koku ${duzenlemeModu === 'yeni' ? 'oluşturulamadı' : 'güncellenemedi'}: ${hataMetni}`);
      }

      const kaydedilenKoku = await response.json();

      setKokular(prevKokular => {
        if (duzenlemeModu === 'yeni') {
          return [...prevKokular, kaydedilenKoku];
        } else {
          return prevKokular.map(k => k.id === kaydedilenKoku.id ? kaydedilenKoku : k);
        }
      });

      setDuzenlemeModu(null);
      setSeciliKoku(null);
      toast.success(`Koku başarıyla ${duzenlemeModu === 'yeni' ? 'oluşturuldu' : 'güncellendi'}`);
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error(`Koku ${duzenlemeModu === 'yeni' ? 'oluşturulurken' : 'güncellenirken'} bir hata oluştu: ${(error as Error).message}`);
    }
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
      {/* Üst Araç Çubuğu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Koku ara..."
            value={filtreKelime}
            onChange={(e) => setFiltreKelime(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={tumunuSec}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            {seciliKokular.length === kokular.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
          </button>
          {seciliKokular.length > 0 && (
            <button
              onClick={secilenleriSil}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Seçilenleri Sil ({seciliKokular.length})
            </button>
          )}
        </div>
        <button
          onClick={yeniKokuOlustur}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
        >
          Yeni Koku Ekle
        </button>
      </div>

      {/* Kokular Tablosu */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={seciliKokular.length === kokular.length}
                  onChange={tumunuSec}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fotoğraf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İsim
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
            {filtrelenmisKokular.map((koku) => (
              <tr key={koku.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={seciliKokular.includes(koku.id)}
                    onChange={() => kokuSec(koku.id)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-16 w-16">
                    <Image
                      src={koku.ana_fotograf}
                      alt={koku.isim}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{koku.isim}</div>
                  <div className="text-sm text-gray-500">{koku.hacim}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {koku.kategori}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(koku.fiyat || 0).toLocaleString('tr-TR')} ₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    koku.stok > 5 ? 'bg-green-100 text-green-800' : 
                    koku.stok > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {koku.stok}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => kokuDuzenle(koku)}
                    className="text-black hover:text-gray-900"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => fotografSil(koku.id, koku.ana_fotograf)}
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

      {/* Düzenleme/Ekleme Modalı */}
      {(duzenlemeModu === 'duzenle' || duzenlemeModu === 'yeni') && seciliKoku && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-medium mb-4">
              {duzenlemeModu === 'yeni' ? 'Yeni Koku Ekle' : 'Koku Düzenle'}
            </h2>
            <form onSubmit={kokuKaydet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İsim</label>
                <input
                  type="text"
                  value={seciliKoku.isim}
                  onChange={(e) => setSeciliKoku({...seciliKoku, isim: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={seciliKoku.aciklama}
                  onChange={(e) => setSeciliKoku({...seciliKoku, aciklama: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat</label>
                  <input
                    type="number"
                    value={seciliKoku.fiyat}
                    onChange={(e) => setSeciliKoku({...seciliKoku, fiyat: Number(e.target.value)})}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stok</label>
                  <input
                    type="number"
                    value={seciliKoku.stok}
                    onChange={(e) => setSeciliKoku({...seciliKoku, stok: Number(e.target.value)})}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={seciliKoku.kategori}
                  onChange={(e) => setSeciliKoku({...seciliKoku, kategori: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  <option value="parfum">Parfüm</option>
                  <option value="oda-kokusu">Oda Kokusu</option>
                  <option value="deodorant">Deodorant</option>
                  <option value="vucut-spreyi">Vücut Spreyi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hacim</label>
                <input
                  type="text"
                  value={seciliKoku.hacim}
                  onChange={(e) => setSeciliKoku({...seciliKoku, hacim: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  required
                  placeholder="Örn: 100ml"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Koku Notları</label>
                <input
                  type="text"
                  value={seciliKoku.koku_notlari}
                  onChange={(e) => setSeciliKoku({...seciliKoku, koku_notlari: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  required
                  placeholder="Örn: Vanilya, Amber, Misk"
                />
              </div>

              {duzenlemeModu === 'duzenle' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraflar</label>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={async (event: DragEndEvent) => {
                      const { active, over } = event;
                      
                      if (!over || active.id === over.id || !seciliKoku) return;

                      const eskiIndex = seciliKoku.fotograflar.findIndex(f => f.url === active.id);
                      const yeniIndex = seciliKoku.fotograflar.findIndex(f => f.url === over.id);

                      if (eskiIndex === -1 || yeniIndex === -1) return;

                      const yeniFotograflar = arrayMove(
                        seciliKoku.fotograflar,
                        eskiIndex,
                        yeniIndex
                      ).map((foto, index) => ({
                        ...foto,
                        sira: index + 1
                      }));

                      try {
                        await fotografSiralamaGuncelle(seciliKoku.id, yeniFotograflar);
                        setSeciliKoku({
                          ...seciliKoku,
                          fotograflar: yeniFotograflar
                        });
                      } catch (error) {
                        console.error('Sıralama güncelleme hatası:', error);
                        toast.error('Fotoğraf sırası güncellenirken bir hata oluştu');
                      }
                    }}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      <SortableContext
                        items={seciliKoku.fotograflar.map(f => f.url)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {seciliKoku.fotograflar.map((foto, index) => (
                          <SortableFoto
                            key={foto.url}
                            foto={foto}
                            index={index}
                            kokuIsim={seciliKoku.isim}
                            onSil={url => fotografSil(seciliKoku.id, url)}
                          />
                        ))}
                      </SortableContext>
                      <label className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 h-[100px]">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              fotografYukle(seciliKoku.id, file);
                            }
                          }}
                        />
                        <span className="text-2xl text-gray-400">+</span>
                      </label>
                    </div>
                  </DndContext>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setDuzenlemeModu(null);
                    setSeciliKoku(null);
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                >
                  {duzenlemeModu === 'yeni' ? 'Oluştur' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 