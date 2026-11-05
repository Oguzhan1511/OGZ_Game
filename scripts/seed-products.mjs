import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const root = path.resolve('.local');
fs.mkdirSync(root, { recursive: true });

const dbPath = path.join(root, 'game.sqlite');
const sqlite = new DatabaseSync(dbPath);

// Ensure drizzle migrations run if table doesn't exist
for (const file of fs
  .readdirSync('drizzle')
  .filter(f => f.endsWith('.sql'))
  .sort()) {
  try {
    sqlite.exec(fs.readFileSync('drizzle/' + file, 'utf8'));
  } catch (e) {
    // Ignore if table already exists
  }
}

function makeSvg(title, category, price) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#121e1d"/>
        <stop offset="100%" stop-color="#0a1211"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#43e5c1" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#43e5c1" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>
    <rect width="600" height="450" fill="url(#glow)"/>
    <rect x="20" y="20" width="560" height="410" rx="16" fill="none" stroke="#2d4a42" stroke-width="2"/>
    <g transform="translate(300, 180)">
      <circle r="60" fill="#1b332d" stroke="#43e5c1" stroke-width="3"/>
      <path d="M-24 -8 L0 -32 L24 -8 L16 24 L-16 24 Z" fill="none" stroke="#43e5c1" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="0" cy="4" r="6" fill="#43e5c1"/>
    </g>
    <text x="300" y="290" text-anchor="middle" fill="#84a69b" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">${category.toUpperCase()}</text>
    <text x="300" y="325" text-anchor="middle" fill="#f0faf5" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">${title}</text>
    <text x="300" y="375" text-anchor="middle" fill="#43e5c1" font-family="system-ui, sans-serif" font-size="13">OGZ GAME · ÜRÜN TAHMİNİ</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const seedItems = [
  // Teknoloji (4 ürün)
  { name: 'Apple iPhone 16 128 GB', category: 'technology', price: 64999 },
  { name: 'Sony WH-1000XM5 Kablosuz Kulaklık', category: 'technology', price: 14499 },
  { name: 'PlayStation 5 Slim 1 TB Konsol', category: 'technology', price: 27999 },
  { name: 'Apple Watch Series 10 46mm GPS', category: 'technology', price: 19999 },

  // Market (4 ürün)
  { name: 'Nutella Kakaolu Fındık Kreması 750 g', category: 'market', price: 185 },
  { name: 'Komili Riviera Zeytinyağı 5 L', category: 'market', price: 1250 },
  { name: 'Çaykur Rize Turist Çayı 1000 g', category: 'market', price: 210 },
  { name: 'Fairy Platinum Bulaşık Kapsülü 75li', category: 'market', price: 495 },

  // Ayakkabı (2 ürün)
  { name: 'Nike Air Force 1 07 Spor Ayakkabı', category: 'shoes', price: 4599 },
  { name: 'Adidas Samba OG Beyaz Ayakkabı', category: 'shoes', price: 4299 },

  // Kıyafet (2 ürün)
  { name: 'Levis 501 Original Erkek Kot Pantolon', category: 'clothing', price: 2899 },
  { name: 'The North Face 1996 Retro Nuptse Mont', category: 'clothing', price: 14999 },

  // Mutfak (2 ürün)
  { name: 'Philips Airfryer XXL Fritöz HD9650', category: 'kitchen', price: 6499 },
  { name: 'Moccamaster KBG Select Filtre Kahve Makinesi', category: 'kitchen', price: 12999 },

  // Ev ve Yaşam (2 ürün)
  { name: 'Dyson V15 Detect Kablosuz Süpürge', category: 'home', price: 28999 },
  { name: 'Ikea Poäng Sallanan Koltuk', category: 'home', price: 3499 },

  // Kozmetik (2 ürün)
  { name: 'Dior Sauvage EDP Erkek Parfüm 100 ml', category: 'cosmetics', price: 5850 },
  { name: 'Yves Saint Laurent Libre EDP Kadın 90 ml', category: 'cosmetics', price: 6200 },

  // Oyuncak & Ofis & Yapı Market (3 ürün)
  { name: 'LEGO Star Wars Millennium Falcon 75257', category: 'toys', price: 6999 },
  { name: 'Logitech MX Master 3S Kablosuz Mouse', category: 'office', price: 3799 },
  { name: 'Bosch Darbeli Matkap GSB 13 RE', category: 'diy', price: 2450 },
];

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/products-seed.json', JSON.stringify(seedItems, null, 2), 'utf8');

const insertStmt = sqlite.prepare(
  'INSERT OR REPLACE INTO products(id, data, created_at) VALUES(?, ?, ?)'
);

let count = 0;
for (const item of seedItems) {
  const id = 'product-seed-' + count;
  const image = makeSvg(item.name, item.category, item.price);
  const record = {
    id,
    name: item.name,
    category: item.category,
    price: item.price,
    image,
    createdAt: Date.now() - (seedItems.length - count) * 60000,
    archived: false,
  };
  insertStmt.run(id, JSON.stringify(record), record.createdAt);
  count++;
}

console.log(`Successfully seeded ${count} products into .local/game.sqlite!`);
const total = sqlite.prepare('SELECT count(*) as n FROM products').get().n;
console.log(`Total products in local database: ${total}`);
