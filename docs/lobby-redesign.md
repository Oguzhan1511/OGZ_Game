# OGZ Game — local lobi tasarımı

Çalışma branch'i: `oguzhan`. Temel commit: `e0f5001` (arkadaşının son lobi değişiklikleri dahil).
Bu çalışma `main` ile birleştirilmedi; Vercel/Sites üzerinde yayın yapılmadı.

## Uygulama

- 56–60 px navigasyon; moda göre değişen kompakt sinematik başlık.
- Tek yatay satırda beş gerçek oyun modu; kırmızı seçili kart ve odak/hover vurguları.
- Solda mod, kategoriler ve kurallar; sağda oda kodu, sekiz oyuncu yuvası, davet ve başlatma alanı.
- Ürün kategorileri doğrudan mevcut `productCategories` kaynağından gelir. Karışık seçimi diğerlerini temizler; özel seçimler karışığı kaldırır. API'ye mevcut kategori anahtarları gönderilir.
- Açık artırma kategorileri mevcut `auction-categories` API'sinden gelir; tek kategori kuralı korunur.
- Ana ekranda sınırlı kategori listesi; fazlası için aramalı seçim penceresi. Misafirler seçili kategorileri bu pencerede salt okunur görebilir.
- Sadece kurucunun yaptığı ayarlar mevcut `change-mode` API'si üzerinden 350 ms beklemeyle eşitlenir. İstekler sıralanır; hızlı değişikliklerde en son taslak korunur. Başlatmadan önce kayıt tamamlanır. Hata görünür ve tekrar denenebilir.
- Oda oluşturma/katılma, kod ve davet URL'leri, oyuncu kimlikleri, oyun kuralları, fiyat gizliliği, puanlama ve sunucu yetkileri korunur. Oyun API'si ve veritabanı şeması değiştirilmedi.
- Küçük telefonda tek sütun ve sabit alt başlatma alanı kullanılır; içerik okunabilir biçimde dikey kaydırılır. Masaüstünde scroll gizlemek yerine yerleşim gerçekten ekrana sığar.

## Dosyalar

- `worker/ui/lobby.js`: lobi stilleri, render fonksiyonları, kategori penceresi ve sıralı ayar eşitleme.
- `worker/ui/app-shell.js`: yeni modül entegrasyonu; eski lobi kodu/tekrarlanan CSS kaldırıldı; oyun başlayınca lobi sınıfı temizlenir.
- `worker/ui/mode-cards.js`: lobi ve mevcut modal seçimlerinin ayrılması.
- `worker/modes/product/product-ui.js`: lobideki karışık seçimin gerçek kategori listesine çevrilmesi.
- `assets/lobby/*.webp`, `worker/ui/lobby-art.js`: beş optimize görsel ve Worker için aynı dosyaların gömülü karşılığı.
- `worker/index.js`: yalnızca bu görseller için statik yanıt; oyun/oda iş mantığı değişmedi.
- `scripts/build-vercel.mjs`: aynı görselleri statik build'e çıkarır.
- `scripts/lobby-test.mjs`, `package.json`: yeni eşitleme davranışı mevcut test paketine eklendi.

## Doğrulama

Gerçek tarayıcıda sekiz kişilik yerel odada ürün modu ile ölçüldü. Belge ölçüsü viewport ile aynı; üç ana panelin her birinde `scrollHeight === clientHeight`.

| Viewport | Belge ölçüsü | Başlat butonunun alt kenarı | Sonuç |
| --- | --- | --- | --- |
| 1920×1080 | 1920×1080 | 1018 px | Taşma yok |
| 1600×900 | 1600×900 | 838 px | Taşma yok |
| 1440×900 | 1440×900 | 838 px | Taşma yok |
| 1366×768 | 1366×768 | 716 px | Taşma yok |

390×844 telefonda yatay taşma yok; sabit başlat düğmesinin alt kenarı 794 px.

- İki ayrı tarayıcı origin'iyle iki gerçek yerel oyuncu: ürün kategorileri, 15 tur / 45 sn ve Sayı Yarışı 10×10 değişikliklerinin misafir ekranına ulaşması doğrulandı. Misafirin ayar kontrolleri devre dışı.
- Aramada “kırtasiye” ile gizli listedeki kategoriyi bulma, çoklu seçim, kaydetme ve seçili kategori sayısı doğrulandı.
- Açık artırmanın altı mevcut kategorisi API'den yüklendi; Hayvan Ordusu seçilerek oyun başlatıldı. İlgili hayvan ve teklif alanı açıldı; `lobby-mode` sınıfı oyun ekranında kalmadı.
- Yeni test: ardışık kayıtlar, güncel gameId kullanımı, son taslağın korunması, değişmemiş ayarlarda gereksiz yazma yapılmaması, misafir yetkisi, kayıt hatası/yeniden deneme ve beş görsel yanıtı.
- `npm test`, `npm run build:vercel`, `git diff --check` başarılı.
- Yalnızca yerel ortam test edildi. Canlı ortamda henüz yayın veya test yapılmadı.

## Mevcut backend sınırları

- Sunucu yalnızca 10 / 15 / 20 tur kabul ediyor. Talimattaki 5 tur, frontend'de çalışıyormuş gibi gösterilmedi.
- Genel lobide bağımsız “hazırım” protokolü yok. Sahte hazır bilgisi yerine gerçek “Lobide” durumu gösteriliyor. Oyunların mevcut başlangıç koşulları değiştirilmedi.
- Çok küçük ekranlarda tüm içeriği aşırı küçültmek yerine mobil tek sütun tercih edildi. Masaüstü için belirtilen dört çözünürlük scroll olmadan doğrulandı.

## Önizlemeler

- `docs/previews/lobby-1366x768.png`: sekiz oyunculu ürün lobisi.
- `docs/previews/lobby-preview.png`: temiz araç lobisi.

## Görsel üretimi

Yerleşik `image_gen` aracı kullanıldı. Son tüketilen dosyalar `assets/lobby/car-price.webp`, `product-price.webp`, `auction.webp`, `number-race.webp`, `battleship.webp`.
Görseller yalnızca boyut/format/sıkıştırma için optimize edildi; toplam 124.100 bayt. Kart ve başlık aynı URL'yi kullanır. Runtime'da görsel üretim servisi çağrılmaz.

Her görsel için kullanılan ortak prompt:

> Use case: stylized-concept. Asset type: wide banner artwork for a premium multiplayer PC game lobby. Subject: [scene]. Style: high quality physically based 3D game cinematic render, realistic materials, sophisticated restrained atmosphere. Landscape 3:2 composition. Subject fully visible in center-right of image with generous framing. Backdrop near-black navy #0c101c; dark moody edges blend to black, crisp subject with controlled highlights. No UI, no border, no typography, no logos, no watermark. Designed to remain recognizable when cropped into a shallow horizontal hero banner.

`[scene]` değerleri:

- Araç: a glossy red performance sports car, low front three-quarter angle, wet asphalt, dramatic red rim lights in a dark underground garage
- Ürün: a premium studio still life of red shopping bags, a smartphone, black headphones, a sneaker and cosmetic bottles, cinematic red and warm gold edge lights
- Açık artırma: a sculptural polished wooden auction gavel resting diagonally above a brass auction block, dramatic golden and orange light, floating gold dust
- Sayı: floating large translucent glass numerals 7, 2, 9 and a turquoise illuminated square digital grid, sense of speed and digital competition, cyan light trails
- Amiral Battı: a modern naval destroyer with sharp silhouette cutting dark ocean waves, night fog and moody blue light, tiny lights on the bridge

## Yerel başlatma

Bu oturumda dev sunucusu, mevcut yerel 542 araç ve 870 ürün kaydını koruyarak `oguzhan` checkout'unun kaynaklarıyla çalışır:

```sh
cd /Users/oguzhanozdemir/Desktop/Ogz_Game/ogz-game
node --watch --watch-path=.local/github-upload/worker .local/github-upload/scripts/dev.mjs
```

URL: http://localhost:4317/

## Kullanıcının üst alan revizyonu

Beş modun hero görseli kullanıcının gönderdiği panoramik görsellerle değiştirildi (`assets/lobby/hero-*.webp`). Kartların mevcut görselleri korunur. Başlıklar Bungee, diğer lobi metinleri Manrope kullanır. Üst alanın kenarlık, radius ve panel zemini kaldırıldı; görsel kenarları zemine yumuşak geçer. Mod değişiminde yüklenen yeni görsel 440 ms giriş, önceki görsel 400 ms çıkış animasyonu kullanır. Hızlı mod değişimlerinde eski yükleme sonucu son seçimi geçersiz kılamaz. Hareket azaltma tercihi desteklenir.

Başlık görselleri yeni `hero-` URL'leriyle sunulur; kart görsellerinin cache'i etkilenmez. WebP karşılıkları ve statik build çıktısı doğrulandı. On görsel toplam 373.738 bayt. Bu revizyon görsel üretimi kullanmaz; gönderilen beş PNG yalnızca WebP formatı/boyut optimizasyonundan geçirilmiştir.

### Ürün görseli kadrajı ve daha büyük başlıklar

Ürün modunda hero görseline ayrı ölçek/konum verildi; çanta sapları, telefon ve kulaklık artık kesilmeden birlikte görünür. Ana başlık 1366 px genişlikte yaklaşık 27 px'ten 32 px'e, geniş ekran üst sınırı 34 px'ten 42 px'e büyütüldü. Panel ve kategori başlıkları da hafif büyütüldü. Bungee/Manrope korunur. 1366×768 ürün lobisinde belge 1366×768 ve üç panelde taşma 0 px; lobi testleri ve statik build başarılı. Önizleme: `docs/previews/product-hero-fit.png`.
