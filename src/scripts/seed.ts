import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeoxbqyhoyoynummkqvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3hicXlob3lveW51bW1rcXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjI2NDEsImV4cCI6MjA0MzY5ODY0MX0.Vw_JM6KVKQ0pxYSUv-KU6ceVUzcWjMBfmgLD0bCBBW8';

const supabase = createClient(supabaseUrl, supabaseKey);

const ornekUrunler = [
  {
    isim: "Fahika Vanilla Dreams",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/leather-bag-gray.jpg",
    fiyat: 299,
    aciklama: "Vanilya ve karamel notalarıyla evinize sıcaklık katın",
    kategori: "Tatlı",
    stok: 10,
    notlar: ["Vanilya", "Karamel", "Tonka"],
    hacim: 200
  },
  {
    isim: "Fahika Ocean Breeze",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/accessories-bag.jpg",
    fiyat: 349,
    aciklama: "Deniz esintisi ve taze notalarla ferah bir ortam",
    kategori: "Ferah",
    stok: 15,
    notlar: ["Deniz Tuzu", "Okyanus", "Bergamot"],
    hacim: 200
  },
  {
    isim: "Fahika Forest Walk",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/ecommerce/analog-classic.jpg",
    fiyat: 399,
    aciklama: "Orman yürüyüşünün tazeliğini evinize taşıyın",
    kategori: "Odunsu",
    stok: 8,
    notlar: ["Çam", "Sedir", "Sandal Ağacı"],
    hacim: 200
  },
  {
    isim: "Fahika Lavender Fields",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/food/spices.jpg",
    fiyat: 299,
    aciklama: "Lavanta tarlalarının huzur veren kokusu",
    kategori: "Çiçeksi",
    stok: 12,
    notlar: ["Lavanta", "Papatya", "Yasemin"],
    hacim: 200
  },
  {
    isim: "Fahika Spice Market",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/food/pot-mussels.jpg",
    fiyat: 449,
    aciklama: "Baharat çarşısının egzotik atmosferi",
    kategori: "Baharatlı",
    stok: 6,
    notlar: ["Tarçın", "Karanfil", "Zencefil"],
    hacim: 200
  },
  {
    isim: "Fahika Cotton Fresh",
    resimUrl: "https://res.cloudinary.com/dqhheif0c/image/upload/v1/samples/landscapes/nature-mountains.jpg",
    fiyat: 299,
    aciklama: "Temiz çamaşır kokusunun ferahlığı",
    kategori: "Ferah",
    stok: 20,
    notlar: ["Pamuk Çiçeği", "Temiz Çamaşır", "Beyaz Misk"],
    hacim: 200
  }
];

async function urunleriEkle() {
  try {
    const { data, error } = await supabase
      .from('urunler')
      .insert(ornekUrunler);

    if (error) throw error;
    console.log('Ürünler başarıyla eklendi:', data);
  } catch (error) {
    console.error('Ürünler eklenirken hata:', error);
  }
}

urunleriEkle(); 