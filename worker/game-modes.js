/**
 * Game Modes Architecture (Strategy Pattern + Registry)
 * 
 * Bu modül oyun modlarını tek bir çatı altında toplar ve modüler hale getirir.
 * İleride 5-10 farklı oyun modu eklendiğinde (örn: 'crypto-price', 'real-estate', vb.)
 * index.js dosyasındaki oda mantığına dokunmadan sadece yeni bir mod stratejisi tanımlayıp
 * sisteme kaydetmek yeterlidir (Open/Closed Principle).
 */

export function createGameModes({
  adminHtml,
  adminApi,
  gameListings,
  productCategories,
  normalizeProductCategories,
  productListings,
  productAsRound,
  productAdminHtml,
  productAdminApi
}) {
  const modes = {
    'car-price': {
      id: 'car-price',
      name: 'Araç fiyatı tahmini',
      description: 'Araç detaylarını incele, fiyata en yakın tahminle puan topla.',
      validateOptions(_b) {
        return null;
      },
      normalizeOptions(_b) {
        return null;
      },
      async loadPool(env, _room, baseCars) {
        const added = await gameListings(env);
        const overrideIds = new Set(added.map(item => item.id));
        return baseCars
          .filter(c => !overrideIds.has(c[11]?.id))
          .concat(added.filter(item => !item.archived).map(item => item.car));
      },
      formatSelectionError(selection, _rounds) {
        return selection.error;
      },
      formatLobbyNotice(_room) {
        return 'Araç fiyatı tahmini';
      },
      adminHtml,
      adminApi,
    },
    'product-price': {
      id: 'product-price',
      name: 'Ürün fiyatı tahmini',
      description: 'Ürün detaylarını incele, fiyata en yakın tahminle puan topla.',
      validateOptions(b) {
        const categories = normalizeProductCategories(b.categories);
        if (!categories) return 'En az bir ürün kategorisi seç.';
        return null;
      },
      normalizeOptions(b) {
        return normalizeProductCategories(b.categories);
      },
      async loadPool(env, room, _baseCars) {
        const products = await productListings(env);
        return products
          .filter(item => !item.archived && room.categories.includes(item.category))
          .map(productAsRound);
      },
      formatSelectionError(selection, rounds) {
        return 'Seçilen kategorilerde ' + selection.available + ' uygun ürün var. ' + rounds + ' tur için yeterli ürün ekle veya kategori seçimini genişlet.';
      },
      formatLobbyNotice(room) {
        return 'Ürün fiyatı tahmini · ' + (room.categories || []).map(key => productCategories[key] || key).join(', ');
      },
      adminHtml: productAdminHtml,
      adminApi: productAdminApi,
    }
  };

  return {
    get(id) {
      return modes[id] || null;
    },
    register(mode) {
      modes[mode.id] = mode;
    },
    has(id) {
      return Boolean(modes[id]);
    },
    all() {
      return Object.values(modes);
    },
    raw: modes
  };
}
