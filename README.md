# OGZ Game

Türkçe, mobil uyumlu araç fiyatı tahmin oyunu. Uygulama `worker/index.js` içindedir; Cloudflare Worker ve D1 kullanır.

- Tarayıcıda saklanan kullanıcı adı ve 10 çizim avatarı veya yüklenen fotoğraf.
- 6 karakterli benzersiz oda kodu, 1–8 oyuncu, oyun modu seçimi, 10/15/20 tur ve 10–120 saniye arasında sürükleyerek veya yazarak ayarlanan tahmin süresi.
- Sunucuda uygulanan tur sonu; süreyi kaçıran oyuncuya 0 puan. Oda sahibi kapatınca kod kalıcı olarak geçersizleşir; boşta kalan odalar en geç 24 saatte sona erer.
- Sunucuda saklanan oda ve puanlar, iki saniyelik lobi güncellemesi.
- Fiyatlar bütün tahminler gelene kadar istemciye gönderilmez.
- 20 örnek ilan rastgele ve tekrar etmeden sıralanır. Görseller temsilidir.
- Puan: `max(0, round(1000 * (1 - abs(tahmin - fiyat) / fiyat)))`.

## Doğrulama

`npm test` oda oluşturma, katılım, yetki, gizli fiyat/oturum bilgileri, mükerrer tahmin engeli, eşit puanlar ve 10 turluk oyunu bellek içi D1 taklidiyle doğrular.
`npm run build` dağıtım dosyalarını hazırlar. Gerçek D1 şeması `drizzle/0000_rooms.sql` içindedir.

## Mevcut sınırlar

Sahibinden bağlantısı veya canlı ilan çekme yoktur. Profil bir hesap sistemi değildir; bu tarayıcıda saklanır. Oyuncu odadan ayrılabilir; oda sahibi odayı kapatarak ayrılır. Tarayıcı sekmesini kapatmak odayı hemen kapatmaz; odalar oluşturulmalarından 24 saat sonra sona erer. İlk Sites yayını yalnızca site sahibine özeldir; arkadaşların erişimi için paylaşım ayarı ayrıca açılmalıdır. Yayındaki oda akışının tarayıcı doğrulaması ChatGPT oturum açma ekranında durmuştur. Yerel önizlemede profil akışı, mobil arayüz, oda ayarları, tur geri sayımı ve kapanan kodun reddedilmesi doğrulanmıştır.

## Tamamlanan ilan havuzu
82 kullanıcı ilanı, 44 model ailesi ve 21 marka. `data/catalog.tsv` kaynak bilgileri;
`assets/listings/` fiyat alanı kırpılmış orijinal fotoğraflar ve değiştirilmemiş hasar şemalarıdır.
`npm run build` katalog ve tek dosyalı Worker paketini üretir. `npm test` oda akışını,
süreleri, skorları, ilan çeşitliliğini, kalıcı geçmişi ve medya doğrulamasını denetler.

Her oyunda model ailesi bir kez seçilir; marka dağılımı dengelenir. Oyunculardan
birinin gördüğü ilan tekrar seçilmez. Devam eden odalardaki ilanlar da rezerve edilir;
kapanan odanın görülmeyen ilanları serbest bırakılır. Yeni ilanlar tur sayısına yetmezse
oyun başlamaz; eski ilanlara otomatik dönüş yapılmaz. Geçmiş tarayıcıdaki profil oturumuna
bağlıdır; tarayıcı verisi silinirse veya farklı cihaz kullanılırsa aynı kimlik korunmaz.

Medya R2 `BUCKET` binding'inde tutulur. Yayın sonrası `scripts/upload-media.mjs`
stdin üzerinden verilen Sites erişim başlığı ve `ASSET_UPLOAD_KEY` ile dosyaları yükler.
Yalnızca kaynak manifestindeki boyut ve SHA-256 ile birebir eşleşen dosyalar kabul edilir.
Anahtar Sites gizli ortam değişkenidir; kaynak koduna veya diske yazılmaz.

## İlan yönetimi
`/admin` sayfasında site sahibi hesabıyla ilan eklenebilir. Yetki sunucuda Sites tarafından iletilen yönetici e-postasıyla kontrol edilir. Araç bilgileri, gerçek fiyat, fiyat görünmeyen araç fotoğrafı ve boya/değişen şeması gereklidir. JPG/PNG/WebP dosyalar en fazla 5 MB olabilir. İlanlar D1 `admin_listings` tablosunda, görseller R2 içinde saklanır. Yeni oyunlar bu ilanları mevcut havuzla birleştirir; devam eden oyunlar kendi katalog anlık görüntüsünü korur. Şu an yalnızca aktif `car-price` modu desteklenir. `0002_admin_listings` migrasyonu dağıtımda uygulanmalıdır.

## Supabase
İlan verileri `kwidsvgcwcgjydfybtfv` projesindeki `ogz_game_listings` tablosunda tutulur. `ogz-game-listings` Edge Function kendi sunucu anahtarını doğrular. `ogz_game_integration` yalnızca anahtarın SHA-256 özetini tutar; asıl anahtar Sites gizli ortam değişkeni `OGZ_SUPABASE_KEY` içindedir. `OGZ_SUPABASE_URL` Edge Function adresidir. Her iki tabloda RLS açık ve tarayıcı rollerinin erişimi kapalıdır.
Görseller R2 üzerinde, oyun odaları ve görülmüş ilan geçmişi D1 üzerinde kalır. Eski D1 ilan kayıtları silinmez; okuma sırasında Supabase kayıtlarıyla kimliğe göre birleştirilir. `/api/admin/supabase-sync` yalnızca sunucu anahtarıyla mevcut D1 ilanlarını tekrar oluşturmadan Supabase'e aktarır. Eski 82 ilan Supabase'e aktarılmıştır; statik katalog mevcut oyunların sırasını korur. Supabase bağlantısı yapılandırıldığında erişim hataları kullanıcıya bildirilir.

## Görselden ilan doldurma
Admin panelindeki “Görselden bilgileri doldur” seçeneği, fotoğrafı solda ve araç bilgileri sağda olan ilan ekran görüntülerini tarayıcıda Tesseract.js 7.0.0 ile okur. Tam ekran görüntüsü sunucuya yüklenmez; kırpılan araç fotoğrafı ve kullanıcının ayrıca seçtiği hasar şeması kayıt sırasında yüklenir. OCR Türkçe ve İngilizce dil dosyalarını ilk kullanımda indirir. Marka, seri/model, yıl, km, fiyat, yakıt, vites ve ağır hasar beyanı doldurulur; okunamayan alanlar kullanıcıya bildirilir. Fotoğraf kırpması ayarlanabilir ve fiyatın görünmediği onaylanmadan kayıt yapılmaz. Bulunmayan boya/değişen bilgisi varsayılmaz; yüklenen şemaya yönlendirilir.

İlan yönetimindeki arama ile kayıtlar bulunabilir; “Düzenle” mevcut bilgiler ve görsellerle formu açar. Görsel seçmeden güncellemede mevcut fotoğraf/şema korunur. “Kaldır” ilanı arşivler; “Kaldırılan ilanları göster” ve “Geri al” ile havuza döndürülebilir. Kalıcı kayıt ve görseller silinmez. Yeni oyunlarda arşivlenen ilanlar seçilmez, düzenlenen eski katalog ilanlarında güncel bilgiler kullanılır. Devam eden oyunlar kendi anlık görüntüsünü korur.

## Yerel oyun ve ilan karıştırma
`npm run dev` oyunu http://localhost:4317 üzerinde başlatır. Local odalar, ilan düzenlemeleri ve geçmiş `.local/game.sqlite` içinde kalır; canlı Supabase verileri değişmez. Local medyalar `.local/media` altında saklanır.
İlan seçiminde görülmemiş kayıtlar önceliklidir. Yeni stok yeterliyken oyunların yaklaşık %30'unda en fazla %10 eski ilan serpiştirilir. Stok azaldığında en az ve en eski görülen ilanlar geri döner; oyun aynı ilanı iki kez içermez. Marka/model ve fiyat aralığı çeşitliliği gözetilir. Aktif odaların rezervasyonları tekrar seçimden korunur. Eski havuz tükenince oyun durmaz.

Araç fiyatı modundaki “Araç kategorisi” seçimi Otomobil veya SUV / Arazi olarak kaydedilir. İki kategori aynı havuzda harmanlanır; aynı markanın farklı otomobil ve SUV modelleri seçilebilir. Aynı model ailesinin farklı ilanları bir oyunda tekrarlanmaz. Yeni ilan kaydından sonra seçilen kategori korunur; art arda SUV yüklenebilir.

## Vercel + GitHub
Vercel runs the gateway in `api/index.mjs` / `server/vercel-app.mjs`. The existing Cloudflare Worker remains the backend for D1 game rooms/history and R2 images; Supabase stores listings. This avoids moving game state into ephemeral Vercel memory. `vercel.json` routes pages and API requests through the gateway. All backend credentials stay in server-only environment variables (see `.env.example`).

`/admin/login` uses the configured administrator username and a salted scrypt password hash. Cookies are signed, HttpOnly, Secure and SameSite=Strict. Login rate limits are persisted in D1. The gateway rejects spoofed identity headers; only its authenticated backend bridge can identify an admin. The public GitHub repository must exclude `.local`, `.env*`, `.vercel`, credentials and local SQLite files.

`npm test` includes the Vercel bridge and authentication checks. `npm run build:vercel` prepares the Vercel build. To update the Cloudflare backend, use the Sites source/deployment workflow and apply the appended D1 migrations. `scripts/migrate-local-to-live.mjs` imports the local listing snapshot and new images through an authenticated server endpoint; credentials arrive only via hidden stdin.

Tahmin girişi yazıldıkça Türkçe binlik ayraçlarıyla biçimlenir. “Bin” mevcut tutarı 1.000, “Milyon” 1.000.000 ile çarpar. İstemci noktaları kaldırıp sunucuya sayısal tutarı gönderir; 10 milyar TL sınırı korunur. Aynı turun lobi güncellemelerinde yazılan tahmin ve imleç korunur.

Aynı oyun turunda diğer oyuncuların tahmin/sayaç güncellemeleri giriş alanını yeniden oluşturmaz. Alanın DOM düğümü, odak ve mobil klavye korunur. Metin biçimlendirme yalnızca gerekli olduğunda değeri değiştirir ve yazım birleştirme olayları tamamlanana kadar bekler. Geciken oda yenileme yanıtları daha yeni oyun durumunu geri alamaz.

Oyun sonunda oda sahibi “Tekrar oyna” ile aynı oda kodu, oyuncular ve ayarlarla yeni oyunu başlatabilir. Puanlar ve tahminler sıfırlanır; ilan geçmişi korunarak yeni tur sırası seçilir. Her oyunun ayrı kimliği vardır; önceki oyunun geciken tahmin/sonraki tur istekleri yeni oyunu etkilemez.
