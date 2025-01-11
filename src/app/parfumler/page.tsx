'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface Parfum {
  id: number;
  isim: string;
  resimUrl: string;
  fiyat: number;
  aciklama: string;
  kategori: string;
  notlar: string[];
  hacim: number;
}

const parfumler: Parfum[] = [
  {
    id: 1,
    isim: "Fahika Elegance",
    resimUrl: "/parfum1.jpg",
    fiyat: 1299,
    aciklama: "Zarif ve kalıcı koku notalarıyla öne çıkan lüks parfüm",
    kategori: "Kadın",
    notlar: ["Yasemin", "Vanilya", "Amber"],
    hacim: 50
  },
  {
    id: 2,
    isim: "Fahika Royal",
    resimUrl: "/parfum2.jpg",
    fiyat: 1499,
    aciklama: "Kraliyet ailesinden esinlenilen özel formül",
    kategori: "Unisex",
    notlar: ["Oud", "Safran", "Misk"],
    hacim: 100
  },
  {
    id: 3,
    isim: "Fahika Sport",
    resimUrl: "/parfum3.jpg",
    fiyat: 999,
    aciklama: "Aktif yaşam tarzı için tasarlanmış ferah koku",
    kategori: "Erkek",
    notlar: ["Bergamot", "Deniz Tuzu", "Sedir"],
    hacim: 75
  },
  {
    id: 4,
    isim: "Fahika Rose Garden",
    resimUrl: "/parfum4.jpg",
    fiyat: 1199,
    aciklama: "Taze gül bahçelerinden ilham alan romantik parfüm",
    kategori: "Kadın",
    notlar: ["Gül", "Şakayık", "Misk"],
    hacim: 50
  },
  {
    id: 5,
    isim: "Fahika Black",
    resimUrl: "/parfum5.jpg",
    fiyat: 1599,
    aciklama: "Gizemli ve baştan çıkarıcı gece parfümü",
    kategori: "Erkek",
    notlar: ["Deri", "Tütün", "Vanilya"],
    hacim: 100
  },
  {
    id: 6,
    isim: "Fahika Fresh",
    resimUrl: "/parfum6.jpg",
    fiyat: 899,
    aciklama: "Yaz mevsiminin tazeliğini yansıtan hafif parfüm",
    kategori: "Unisex",
    notlar: ["Limon", "Yeşil Çay", "Okyanus"],
    hacim: 75
  }
];

export default function Parfumler() {
  const [kategoriFilter, setKategoriFilter] = useState<string>('');
  const [aramaMetni, setAramaMetni] = useState<string>('');

  const filtrelenmisPerfumler = parfumler.filter(parfum => {
    const kategoriUygun = kategoriFilter ? parfum.kategori === kategoriFilter : true;
    const aramaUygun = parfum.isim.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                      parfum.aciklama.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUygun && aramaUygun;
  });

  const whatsappYonlendir = (parfum: Parfum) => {
    const mesaj = `Merhaba, ${parfum.isim} parfümü hakkında bilgi almak istiyorum.`;
    const whatsappUrl = `https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(mesaj)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section className="text-center">
              <h1 className="text-5xl font-bold mb-6">Parfümlerimiz</h1>
              <p className="text-xl text-gray-600 mb-8">
                Size özel tasarlanmış eşsiz kokular
              </p>
            </section>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setKategoriFilter('')}
                  className={`px-4 py-2 rounded-full ${
                    kategoriFilter === '' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setKategoriFilter('Kadın')}
                  className={`px-4 py-2 rounded-full ${
                    kategoriFilter === 'Kadın' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Kadın
                </button>
                <button
                  onClick={() => setKategoriFilter('Erkek')}
                  className={`px-4 py-2 rounded-full ${
                    kategoriFilter === 'Erkek' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Erkek
                </button>
                <button
                  onClick={() => setKategoriFilter('Unisex')}
                  className={`px-4 py-2 rounded-full ${
                    kategoriFilter === 'Unisex' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Unisex
                </button>
              </div>

              <input
                type="text"
                placeholder="Parfüm ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtrelenmisPerfumler.map((parfum) => (
                <motion.div
                  key={parfum.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-64">
                    <Image
                      src={parfum.resimUrl}
                      alt={parfum.isim}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{parfum.isim}</h3>
                      <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                        {parfum.hacim}ml
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{parfum.aciklama}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Koku Notaları:</h4>
                      <div className="flex flex-wrap gap-2">
                        {parfum.notlar.map((not, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                          >
                            {not}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{parfum.fiyat} TL</span>
                      <button
                        onClick={() => whatsappYonlendir(parfum)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Bilgi Al
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 