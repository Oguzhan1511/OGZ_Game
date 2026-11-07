# Sayı Yarışı: tıklama ve tur senkronizasyonu

- İşaret gönderimi 40 ms paketleme ile yapılır. Önceki istek sürerken kabul edilen tıklamalar sonraki pakette korunur; geçici hatalarda tekrar denenir.
- Bulma/süre bitişinden sonra tur kısa bir eşitleme aşamasına girer. İşaretleyen oyuncunun kuyruğu sunucu tarafından onaylanınca roller değişir. Oyuncu bağlantısı kopmuşsa 3 saniyelik sınır oyunun takılmasını önler.
- Eşitlemede yalnızca tur kapanışından önceki tıklamalar kabul edilir. Sonraki tura geçildikten sonra eski turun paketleri sayacı değiştiremez.
- Sayı arama tıklamaları genel arayüzün meşgul durumundan bağımsız sıraya alınır. Yanlış sayıya basıldıktan hemen sonra gelen yeni tıklama kaybolmaz.
- Sunucu saatinin hesaplanmasında istek işleme süresi ayrıştırılır; geciken yanıtların saat göstergesini kaydırması azaltılır.
- Kaydedilmeyi bekleyen işaretler farklı görünür ve üst sayaçta bekleyen adet gösterilir.
- Oyun temposu için arayüzde iki kutu işaretleme arasında 250 ms bekleme vardır (en fazla 4 kutu/sn). Bekleme boyunca boş kutular geçici olarak pasifleşir. Sayıyı arayan kişinin tıklamalarına bu bekleme uygulanmaz.

## Doğrulama

`npm test`: 4×4, 6×6, 10×10; eş zamanlı istekler, tekrar paketler, kopuk bağlantı, tur kapanış zamanı, eski tur/yeni oyun yanıtları, kuyruk boşaltma, bulma kuyruğu ve 250 ms bekleme senaryoları.

Local tarayıcıda 6×6 test odasında ardışık 20 yeni işaretin tamamı kaydedildi; önceki 2 işaretle birlikte hem ekran hem sunucu 22 gösterdi ve sonraki turda aynı kaldı. Tarayıcı konsolunda hata yoktu. `npm run build:vercel` yerel derlemedir; dağıtım yapılmaz.

250 ms bekleme eklendikten sonra tarayıcıda 10 yeni kutu daha işaretlendi; sayaç 22'den 32'ye çıktı. Otomatik tıklamalar boş kutuların yeniden etkinleşmesini bekledi; ölçülen aralıklar 366–382 ms idi (arayüz otomasyonu ek süresi dahil).
