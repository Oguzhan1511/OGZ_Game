# Oyun performansı

Oyun verisi Supabase Postgres'te, görseller Supabase Storage'dadır. Vercel mevcut oturum/admin ağ geçidini, Worker web arayüzünü ve yönetimi sunar.

## Oyun istekleri

Önce: tarayıcı → Vercel → Worker → her SQL işlemi için ayrı Supabase Function → PostgREST → Postgres.

Şimdi: tarayıcı → Vercel → Worker → `ogz-game-room` (veritabanıyla aynı bölge) → doğrudan PostgREST RPC. Oyun yetkilendirmesi, süre/hamle doğrulaması ve puanlama sunucudadır. Anahtar istemciye gönderilmez. Oda yazma ve rezervasyonlar mevcut atomik RPC ve satır kilitlerini kullanır.

`OGZ_GAME_ENGINE=edge` hızlı motoru açar; `OGZ_DB_REGION` mevcut proje için `ap-northeast-2` olmalıdır. Bayrak kapatılırsa Worker'daki uyumlu oyun motoru aynı Supabase kayıtlarıyla çalışabilir. Ayrı veritabanına geri dönüş yoktur.

- Odalar tüm havuz yerine yalnızca seçilmiş tur kayıtlarını saklar.
- Bir HTTP isteğinde aynı oda ikinci kez okunmaz; yazmadan sonra okuma önbelleği temizlenir.
- Tur seçiminin geçmiş/rezervasyon işlemleri tek RPC'de yapılır.
- Polling tek istekle sınırlıdır ve sekme gizliyken durur.
- Sonraki görseller yalnızca mevcut turun cevapları kilitlendikten sonra yüklenir. Gelecekteki fiyatlar paylaşılmaz.

## Görseller

`worker/image-variants.js`, yüklenip doğrulanmış küçük WebP kopyalarının listesidir. `gameImage` sadece listedeki dosyaları kullanır, diğerlerinde orijinali korur. Orijinal ilan ve admin görselleri silinmez. Fiyat ve araç bilgileri değiştirilmez.

## Güncelleme

`npm run build`, ortak modüler `RoomService` ve oyun stratejilerinden Supabase fonksiyonunun `engine.js` dosyasını ve bağımlılıklarını yeniden üretir. Oyun mantığı değiştiğinde hem `ogz-game-room` fonksiyonu hem site dağıtılmalıdır; iki farklı el yazımı oyun motoru tutulmaz.

`npm test`, tahmin odağı, tekil polling, gizli fiyatlar, kompakt oda kayıtları, açık artırma sıraları ve CAS davranışını kontrol eder. Canlı gecikme ölçümlerinde soğuk başlangıç ile sıcak istekleri ve ağ değişkenliğini ayrı değerlendirin.
