# 🎂 Nurefşan'ın Doğum Günü Websitesi v2

Pembe & Altın tema, tam özellikli doğum günü mesaj platformu.

---

## ✨ Yeni Özellikler (v2)

| Özellik | Açıklama |
|---------|----------|
| 🎀 Dilek Kartı | Tıklayınca çevrilip açılan 3D animasyonlu kart |
| 📖 Anı Kartları | "Seni nasıl tanıdım" hikaye kartları, kaç yıldır tanıştıklarıyla |
| 🎤 Ses Mesajı | Mikrofon ile sesli mesaj kaydetme & dinleme |
| 🔐 Gizli Mesaj | Şifre ile açılan sadece Nurefşan'ın görebileceği mesaj |
| 🛡 Admin Paneli | Mesajları görme, onaylama ve silme |
| 🎵 Arka Plan Müziği | `music.mp3` eklenince açılır/kapanır |
| 🌙 Karanlık Tema | Gündüz/gece geçişi |
| 💫 Özel Cursor | Kalp & altın yüzük imleci |

---

## 📁 Klasör Yapısı

```
birthday-site/
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── style.css
    ├── app.js
    ├── music.mp3        ← BU DOSYAYI EKLE (isteğe bağlı)
    └── audio/           ← ses mesajları buraya kaydedilir (otomatik)
```

---

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Sunucuyu başlat
npm start
# veya geliştirme için:
npm run dev

# 3. Tarayıcıda aç
http://localhost:3000
```

---

## 🔧 Özelleştirme

### Şifreleri Değiştir
`public/app.js` dosyasını aç ve en üstteki satırları güncelle:

```js
const ADMIN_PASS  = 'admin123';    // ← admin paneli şifresi
const SECRET_PASS = 'nurefsan';    // ← gizli mesaj şifresi
const SECRET_MSG  = `Seni çok seviyorum...`; // ← gizli mesaj içeriği
```

### Arka Plan Müziği
Sevdiği bir müzik dosyasını `public/music.mp3` olarak kaydet.
(MP3 formatı önerilir, 5MB altı tutulursa iyi olur)

### Dilek Kartı Mesajı
`public/index.html` içinde `.flip-back-message` içindeki metni değiştir.

### Admin Paneli Erişimi
Web sitesinde **sağ alt köşeye 5 kez tıkla** → Admin paneli açılır.
Şifre: `admin123` (yukarıdan değiştirilebilir)

---

## 🌐 Yayına Alma

### Render.com (Önerilen, Ücretsiz)
1. GitHub'a yükle
2. [render.com](https://render.com) → New Web Service
3. Environment Variables ekle:
   - `MONGO_URI` = Atlas connection string
   - `ADMIN_TOKEN` = güçlü bir şifre
4. Deploy!

### Ortam Değişkenleri (.env)
```
MONGO_URI=mongodb+srv://...
ADMIN_TOKEN=guclu_bir_sifre
PORT=3000
```

---

*Nurefşan için ❤️ ile yapıldı — v2.0*
