# Amiral Battı: filo göstergeleri ve savaş sesleri

Oyuncu kartlarında beş gemi adlarıyla gösterilir. Sağlam gemiler mavi, isabet alanlar sarı ve vurulan bölüm sayısıyla, batanlar kırmızı ve “BATTI” etiketiyle görünür. Sunucu her oyuncu için yalnızca gemi türü, isabet sayısı ve durumunu gönderir; batmamış rakip gemilerin koordinatlarını açmaz.

Top atışı, metal isabeti, karavana/suya düşme ve batma için ayrı, önbelleklenen PCM efektleri kullanılır. Sesler tarayıcıda üretilir; ek dosya indirilmez. Atışın düşük frekanslı patlaması, isabetin metalik darbesi ve batmanın üç aşamalı patlama/gövde/su kuyruğu farklıdır. İsabet sesi top atışını kesmez. Rakibin atışı da duyulur. Aynı atış tekrarlanan oda güncellemelerinde yeniden çalınmaz. Son geminin batma sesi sonuç ekranına geçişte korunur; ses kapatma ve ses düzeyi ayarları geçerlidir.

Aktif odaya bağlantı üzerinden yeniden girerken arayüz kilidi çizimden önce kaldırılır. Böylece sayfa yenilenince atış düğmeleri pasif kalmaz.

Doğrulama: `npm test`, `npm run build:vercel`; gemi başına sağlam/isabet/batma, koordinat gizliliği, atış tekrarı, son batma, ses önbelleği, sessize alma ve 22050/44100/48000 Hz sonlu ve taşmayan örnekler. Local tarayıcıda Muhrip batırılıp Uçak Gemisi vuruldu; 1366×768, 390×844 ve 375×667 boyutlarında filo kartları görünür ve sayfa taşması yok. Yenileme sonrası 97 vurulmamış kareye yeniden ateş edilebildi.
