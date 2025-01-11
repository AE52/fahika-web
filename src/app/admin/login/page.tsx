'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basit bir şifre kontrolü (gerçek uygulamada daha güvenli bir yöntem kullanılmalı)
    if (sifre === 'fahika2024') {
      localStorage.setItem('adminGiris', 'true');
      router.push('/admin');
    } else {
      setHata('Geçersiz şifre');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-light text-gray-800">
            Admin Girişi
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={girisYap}>
          <div>
            <label htmlFor="sifre" className="sr-only">
              Şifre
            </label>
            <input
              id="sifre"
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Şifre"
              required
            />
          </div>

          {hata && (
            <p className="text-red-500 text-sm text-center">{hata}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 