"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminPage = () => {
  const router = useRouter();
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
          router.push('/giris');
        }
      } catch (error) {
        console.error('Yetkilendirme hatası:', error);
        router.push('/giris');
      }
    };

    checkAuth();
  }, [router]); // router dependency olarak eklendi

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/urunler`);
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setUrunler(data.urunler || []);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setError('Ürünler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchUrunler();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/api/urunler/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ürün silinirken bir hata oluştu');
      }

      setUrunler(urunler.filter((urun: any) => urun._id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
      setError('Ürün silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <Link 
          href="/admin/urun-ekle"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Yeni Ürün Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {urunler.map((urun: any) => (
          <div key={urun._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="relative h-48 mb-4">
              <Image
                src={urun.ana_fotograf || '/placeholder.png'}
                alt={urun.isim}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{urun.isim}</h2>
            <p className="text-gray-600 mb-2">{urun.fiyat} TL</p>
            <p className="text-gray-500 mb-4 line-clamp-2">{urun.aciklama}</p>
            <div className="flex justify-end gap-2">
              <Link
                href={`/admin/urun-duzenle/${urun._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => handleDelete(urun._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage; 