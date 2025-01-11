import requests
import json

# API endpoint
url = "http://localhost:5000/api/kokular"
headers = {"Content-Type": "application/json"}

# Örnek ürünler
products = [
    {
        "isim": "Lavanta Rüyası",
        "slug": "lavanta-ruyasi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1595159814851-3309fc27b4a4", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1595159814862-a94f24732679", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1595159814851-3309fc27b4a4",
        "fiyat": 329,
        "aciklama": "Sıcak ve tatlı lavanta notalarıyla hazırlanan bu oda kokusu, evinize huzur verici bir atmosfer katacak.",
        "kategori": "oda-kokusu",
        "stok": 45,
        "koku_notlari": "Lavanta, Vanilya, Paçuli",
        "hacim": "100ml"
    },
    {
        "isim": "Vanilya Rüyası",
        "slug": "vanilya-ruyasi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1557683304-673a23048d34", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1557683311-eac922347aa1", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1557683304-673a23048d34",
        "fiyat": 349,
        "aciklama": "Sıcak ve tatlı vanilya notalarıyla hazırlanan bu oda kokusu, evinize sıcak ve davetkar bir atmosfer katacak.",
        "kategori": "oda-kokusu",
        "stok": 35,
        "koku_notlari": "Vanilya, Karamel, Tonka Fasulyesi",
        "hacim": "100ml"
    },
    {
        "isim": "Okyanus Esintisi",
        "slug": "okyanus-esintisi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "fiyat": 299,
        "aciklama": "Ferah ve temiz okyanus notalarıyla hazırlanan bu oda kokusu, evinize deniz ferahlığı getirecek.",
        "kategori": "oda-kokusu",
        "stok": 50,
        "koku_notlari": "Deniz Tuzu, Okaliptüs, Bergamot",
        "hacim": "100ml"
    },
    {
        "isim": "Gül Bahçesi",
        "slug": "gul-bahcesi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1548198470-6c555d671b8c", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1548198470-6c555d671b8c", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1548198470-6c555d671b8c",
        "fiyat": 379,
        "aciklama": "Taze gül notalarıyla hazırlanan bu oda kokusu, evinize bahar tazeliği getirecek.",
        "kategori": "oda-kokusu",
        "stok": 30,
        "koku_notlari": "Gül, Yasemin, Amber",
        "hacim": "100ml"
    },
    {
        "isim": "Yasemin Büyüsü",
        "slug": "yasemin-buyusu",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f",
        "fiyat": 359,
        "aciklama": "Zarif yasemin notalarıyla hazırlanan bu oda kokusu, evinize çiçeksi bir ferahlık katacak.",
        "kategori": "oda-kokusu",
        "stok": 40,
        "koku_notlari": "Yasemin, Beyaz Çiçekler, Misk",
        "hacim": "100ml"
    },
    {
        "isim": "Sandal Ağacı",
        "slug": "sandal-agaci",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1544441892-794166f1e3be", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1544441892-794166f1e3be", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1544441892-794166f1e3be",
        "fiyat": 399,
        "aciklama": "Egzotik sandal ağacı notalarıyla hazırlanan bu parfüm, size uzak diyarların gizemini getirecek.",
        "kategori": "parfum",
        "stok": 25,
        "koku_notlari": "Sandal Ağacı, Sedir, Amber",
        "hacim": "50ml"
    },
    {
        "isim": "Akşam Yıldızı",
        "slug": "aksam-yildizi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1534945644675-24335ae1f713", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1534945644675-24335ae1f713", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1534945644675-24335ae1f713",
        "fiyat": 449,
        "aciklama": "Büyüleyici gece çiçekleri ve amber notalarıyla hazırlanan bu parfüm, akşamlarınıza şıklık katacak.",
        "kategori": "parfum",
        "stok": 20,
        "koku_notlari": "Gece Yasemini, Amber, Vanilya",
        "hacim": "50ml"
    },
    {
        "isim": "Bahar Esintisi",
        "slug": "bahar-esintisi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
        "fiyat": 289,
        "aciklama": "Taze çiçek ve yeşil notalarla hazırlanan bu oda kokusu, evinize bahar tazeliği getirecek.",
        "kategori": "oda-kokusu",
        "stok": 55,
        "koku_notlari": "Yeşil Notalar, Frezya, Mandalina",
        "hacim": "100ml"
    },
    {
        "isim": "Oryantal Gece",
        "slug": "oryantal-gece",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab",
        "fiyat": 479,
        "aciklama": "Egzotik baharatlar ve amber notalarıyla hazırlanan bu parfüm, size Doğu'nun gizemini sunacak.",
        "kategori": "parfum",
        "stok": 15,
        "koku_notlari": "Amber, Ud, Baharat",
        "hacim": "50ml"
    },
    {
        "isim": "Limon Çiçeği",
        "slug": "limon-cicegi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1528821128474-27f963b062bf", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1528821128474-27f963b062bf", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1528821128474-27f963b062bf",
        "fiyat": 279,
        "aciklama": "Ferah limon ve çiçek notalarıyla hazırlanan bu oda kokusu, evinize Akdeniz esintisi getirecek.",
        "kategori": "oda-kokusu",
        "stok": 60,
        "koku_notlari": "Limon, Portakal Çiçeği, Bergamot",
        "hacim": "100ml"
    },
    {
        "isim": "Misk & Amber",
        "slug": "misk-amber",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc",
        "fiyat": 429,
        "aciklama": "Sıcak misk ve amber notalarıyla hazırlanan bu parfüm, size sofistike bir şıklık katacak.",
        "kategori": "parfum",
        "stok": 30,
        "koku_notlari": "Misk, Amber, Vanilya",
        "hacim": "50ml"
    },
    {
        "isim": "Paçuli Rüyası",
        "slug": "paculi-ruyasi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1544441893-675973e31985",
        "fiyat": 389,
        "aciklama": "Egzotik paçuli ve odunsu notalarla hazırlanan bu parfüm, size doğanın gizemini sunacak.",
        "kategori": "parfum",
        "stok": 25,
        "koku_notlari": "Paçuli, Sedir, Misk",
        "hacim": "50ml"
    },
    {
        "isim": "Mandalina Bahçesi",
        "slug": "mandalina-bahcesi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1547514701-42782101795e", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1547514701-42782101795e", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1547514701-42782101795e",
        "fiyat": 269,
        "aciklama": "Taze mandalina ve narenciye notalarıyla hazırlanan bu oda kokusu, evinize enerji katacak.",
        "kategori": "oda-kokusu",
        "stok": 50,
        "koku_notlari": "Mandalina, Portakal, Bergamot",
        "hacim": "100ml"
    },
    {
        "isim": "Gece Yasemini",
        "slug": "gece-yasemini",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1567445510548-78e4d24d7f6f",
        "fiyat": 419,
        "aciklama": "Büyüleyici gece yasemini ve beyaz çiçek notalarıyla hazırlanan bu parfüm, gecelere şıklık katacak.",
        "kategori": "parfum",
        "stok": 20,
        "koku_notlari": "Yasemin, Tuberoz, Misk",
        "hacim": "50ml"
    },
    {
        "isim": "Çam Ormanı",
        "slug": "cam-ormani",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1511497584788-876760111969", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1511497584788-876760111969", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1511497584788-876760111969",
        "fiyat": 299,
        "aciklama": "Ferah çam ve odunsu notalarla hazırlanan bu oda kokusu, evinize orman ferahlığı getirecek.",
        "kategori": "oda-kokusu",
        "stok": 45,
        "koku_notlari": "Çam, Sedir, Okaliptüs",
        "hacim": "100ml"
    },
    {
        "isim": "Amber & Vanilya",
        "slug": "amber-vanilya",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc",
        "fiyat": 439,
        "aciklama": "Sıcak amber ve vanilya notalarıyla hazırlanan bu parfüm, size zarif bir şıklık sunacak.",
        "kategori": "parfum",
        "stok": 25,
        "koku_notlari": "Amber, Vanilya, Tonka Fasulyesi",
        "hacim": "50ml"
    },
    {
        "isim": "Bergamot & Lavanta",
        "slug": "bergamot-lavanta",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1595159814851-3309fc27b4a4", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1595159814862-a94f24732679", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1595159814851-3309fc27b4a4",
        "fiyat": 289,
        "aciklama": "Ferah bergamot ve sakinleştirici lavanta notalarıyla hazırlanan bu oda kokusu, evinize huzur katacak.",
        "kategori": "oda-kokusu",
        "stok": 55,
        "koku_notlari": "Bergamot, Lavanta, Paçuli",
        "hacim": "100ml"
    },
    {
        "isim": "Gül & Yasemin",
        "slug": "gul-yasemin",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1548198470-6c555d671b8c", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1548198470-6c555d671b8c", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1548198470-6c555d671b8c",
        "fiyat": 459,
        "aciklama": "Zarif gül ve yasemin notalarıyla hazırlanan bu parfüm, size çiçeksi bir zarafet sunacak.",
        "kategori": "parfum",
        "stok": 20,
        "koku_notlari": "Gül, Yasemin, Misk",
        "hacim": "50ml"
    },
    {
        "isim": "Portakal Çiçeği",
        "slug": "portakal-cicegi",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1528821128474-27f963b062bf", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1528821128474-27f963b062bf", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1528821128474-27f963b062bf",
        "fiyat": 279,
        "aciklama": "Taze portakal çiçeği notalarıyla hazırlanan bu oda kokusu, evinize bahar tazeliği getirecek.",
        "kategori": "oda-kokusu",
        "stok": 60,
        "koku_notlari": "Portakal Çiçeği, Mandalina, Bergamot",
        "hacim": "100ml"
    },
    {
        "isim": "Ud & Amber",
        "slug": "ud-amber",
        "fotograflar": [
            {"url": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab", "sira": 1},
            {"url": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab", "sira": 2}
        ],
        "ana_fotograf": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab",
        "fiyat": 499,
        "aciklama": "Egzotik ud ve sıcak amber notalarıyla hazırlanan bu parfüm, size Doğu'nun lüksünü sunacak.",
        "kategori": "parfum",
        "stok": 15,
        "koku_notlari": "Ud, Amber, Sandal Ağacı",
        "hacim": "50ml"
    }
]

# Her bir ürünü API'ye gönder
for product in products:
    try:
        response = requests.post(url, headers=headers, json=product)
        if response.status_code in [200, 201]:
            print(f"Ürün başarıyla eklendi: {product['isim']}")
        else:
            print(f"Hata: {product['isim']} eklenemedi. Status code: {response.status_code}")
    except Exception as e:
        print(f"Hata: {product['isim']} eklenirken bir hata oluştu - {str(e)}") 