export const json = (v, s = 200) => new Response(JSON.stringify(v), {
  status: s,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
});

export function validProfile(p) {
  return p && typeof p.name === 'string' && p.name.trim().length >= 2 && p.name.length <= 20 && typeof p.avatar === 'string' && p.avatar.length < 400000 && (/^a[0-9]$/.test(p.avatar) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.avatar));
}

export function view(r, id, cars) {
  const result = structuredClone(r);
  result.serverNow = Date.now();
  delete result.order;
  delete result.customCars;
  result.isHost = r.host === id;
  delete result.host;
  result.hasGuessed = !!r.guesses[r.players.find(p => p.token === id)?.id];
  result.players = result.players.map(p => { delete p.token; return p; });
  result.me = r.players.find(p => p.token === id)?.id;
  if (r.state !== 'lobby') {
    const c = (r.customCars || []).concat(cars)[r.order[r.round]];
    result.car = c.filter((_, i) => i !== 6);
    result.submitted = Object.keys(r.guesses).length;
    if (r.state === 'reveal' || r.state === 'finished') {
      result.price = c[6];
      result.guesses = r.guesses;
    } else {
      delete result.guesses;
    }
  }
  return result;
}

export function revealRound(r, cars) {
  if (r.state !== 'playing') return;
  r.state = 'reveal';
  const price = (r.customCars || []).concat(cars)[r.order[r.round]][6];
  r.results = r.players.map(p => {
    const guess = r.guesses[p.id] ?? null;
    return {
      id: p.id,
      guess,
      points: guess === null ? 0 : Math.max(0, Math.round(1000 * (1 - Math.abs(guess - price) / price)))
    };
  });
  r.players.forEach(p => p.score += r.results.find(x => x.id === p.id).points);
}

export function createRoomService({ gameModes, cars, selectListings, auctionApi, auctionCatalog }) {
    return async function roomApi(req, env) {
    if (!env.DB) return json({ error: 'Oda servisi henüz hazır değil.' }, 503);
    let b;
    try { b = await req.json(); } catch { return json({ error: 'Geçersiz istek' }, 400); }
    if (!b || typeof b !== 'object') return json({ error: 'Geçersiz istek' }, 400);
    const { action, token } = b;
    if (action === 'auction-categories') {
      if (!auctionCatalog) return json({ categories: [] });
      const { catalog } = await auctionCatalog(env);
      return json({
        categories: catalog.categories.filter(c => !c.archived).map(c => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          available: c.products.filter(p => !p.archived).length
        }))
      });
    }
    if (action === 'create' && b.mode === 'auction') {
      if (auctionApi) return await auctionApi(b, env);
    }
    if (['create', 'join'].includes(action) && !validProfile(b.profile)) return json({ error: 'Oda oluşturmak veya katılmak için önce profilini tamamlamalısın.' }, 400);
    if (typeof token !== 'string' || token.length < 20) return json({ error: 'Profil oturumu geçersiz' }, 400);
    if (action === 'create') {
      if (![10, 15, 20].includes(b.rounds)) return json({ error: 'Tur sayısı geçersiz' }, 400);
      const selectedMode = gameModes.get(b.mode);
      if (!selectedMode) return json({ error: 'Geçerli bir oyun modu seç.' }, 400);
      const modeErr = selectedMode.validateOptions(b);
      if (modeErr) return json({ error: modeErr }, 400);
      const categories = selectedMode.normalizeOptions(b);
      if (!Number.isInteger(b.guessSeconds) || b.guessSeconds < 10 || b.guessSeconds > 120) return json({ error: 'Tahmin süresi geçersiz' }, 400);
      for (let attempt = 0; attempt < 8; attempt++) {
        const code = crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase();
        const r = { code, host: token, mode: b.mode, categories, guessSeconds: b.guessSeconds, state: 'lobby', gameId: crypto.randomUUID(), rounds: b.rounds, round: 0, expiresAt: Date.now() + 86400000, players: [{ ...b.profile, token, id: crypto.randomUUID(), score: 0 }], guesses: {}, order: [] };
        const result = await env.DB.prepare('INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)').bind(code, JSON.stringify(r), Date.now()).run();
        if (result.meta.changes) return json(view(r, token, cars));
      }
      return json({ error: 'Oda kodu üretilemedi. Tekrar dene.' }, 503);
    }
    const code = String(b.code || '').trim().toUpperCase();
    if (!/^[A-F0-9]{6}$/.test(code)) return json({ error: 'Geçerli bir 6 karakterli oda kodu gir.' }, 400);
    for (let attempt = 0; attempt < 8; attempt++) {
      const row = await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?').bind(code).first();
      if (!row) return json({ error: 'Bu oda kodu geçersiz veya oda kapatılmış.', closed: true }, 404);
      const r = JSON.parse(row.data);
      if (r.mode === 'auction' && auctionApi) return await auctionApi(b, env);
      if (r.state === 'closed') return json({ error: 'Bu oda kapatıldı. Oda kodu artık geçersiz.', closed: true }, 410);
      if (r.expiresAt && Date.now() >= r.expiresAt) {
        r.state = 'closed';
        r.closedAt = Date.now();
        const expiredBatch = await env.DB.batch([
          env.DB.prepare('DELETE FROM listing_reservations WHERE room_code=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)').bind(code, code, row.version),
          env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(r), code, row.version)
        ]);
        const update = expiredBatch[1];
        if (!update.meta.changes) continue;
        return json({ error: 'Odanın süresi doldu. Oda kodu artık geçersiz.', closed: true }, 410);
      }
      const player = r.players.find(p => p.token === token);
      if (!player && action !== 'join') return json({ error: 'Bu odaya önce katılmalısın.' }, 403);
      if (b.gameId && b.gameId !== r.gameId && ['guess', 'next', 'restart'].includes(action)) return json({ error: 'Bu oyun tamamlandı. Oda güncelleniyor; tekrar dene.' }, 409);
      const expired = r.state === 'playing' && r.deadline && Date.now() >= r.deadline;
      if (expired) revealRound(r, cars);
      let actionError = null;
      if (action === 'join' && !player) {
        if (r.state !== 'lobby') return json({ error: 'Bu odada oyun başladı.' }, 409);
        if (r.players.length >= 8) return json({ error: 'Oda dolu (8 kişi).' }, 409);
        r.players.push({ ...b.profile, token, id: crypto.randomUUID(), score: 0 });
      }
      if (action === 'get' && !expired) return json(view(r, token, cars));
      let reserve = false;
      if (action === 'start' || action === 'restart') {
        if (r.host !== token || r.state !== (action === 'restart' ? 'finished' : 'lobby')) return json({ error: action === 'restart' ? 'Yeni oyunu yalnızca oda sahibi, oyun bittikten sonra başlatabilir.' : 'Oyunu yalnızca oda sahibi başlatabilir.' }, 403);
        const tokens = r.players.map(p => p.token);
        await env.DB.prepare('DELETE FROM listing_reservations WHERE expires_at<=?').bind(Date.now()).run();
        const placeholders = tokens.map(() => '?').join(',');
        const history = await env.DB.prepare('SELECT listing_id,SUM(seen_count) AS seen_count,MAX(seen_at) AS last_seen FROM listing_history WHERE token IN (' + placeholders + ') GROUP BY listing_id').bind(...tokens).all();
        const reservations = await env.DB.prepare('SELECT listing_id FROM listing_reservations WHERE token IN (' + placeholders + ')').bind(...tokens).all();
        const modeHandler = gameModes.get(r.mode) || gameModes.get('car-price');
        r.customCars = await modeHandler.loadPool(env, r, cars);
        const currentPool = r.customCars;
        const selection = selectListings(currentPool, r.rounds, new Set(reservations.results.map(h => h.listing_id)), Math.random, new Map(history.results.map(h => [h.listing_id, { seenCount: h.seen_count, lastSeen: h.last_seen }])));
        if (selection.error) return json({ error: modeHandler.formatSelectionError(selection, r.rounds), available: selection.available }, 409);
        if (action === 'restart') {
          r.gameId = crypto.randomUUID();
          r.round = 0;
          r.guesses = {};
          delete r.results;
          r.players.forEach(player => player.score = 0);
          r.expiresAt = Date.now() + 86400000;
        }
        r.order = selection.order;
        reserve = true;
        r.state = 'playing';
        r.deadline = Date.now() + (r.guessSeconds || 30) * 1000;
      }
      if (action === 'guess') {
        if (expired) actionError = 'Tahmin süresi doldu.';
        else {
          if (r.state !== 'playing' || r.guesses[player.id] != null) return json({ error: 'Bu tur için tahmin zaten alındı veya tur kapandı.' }, 409);
          const g = Number(b.guess);
          if (!Number.isFinite(g) || g < 1 || g > 10000000000) return json({ error: 'Geçerli bir fiyat gir.' }, 400);
          r.guesses[player.id] = g;
          if (Object.keys(r.guesses).length === r.players.length) revealRound(r, cars);
        }
      }
      if (action === 'next') {
        if (r.host !== token || r.state !== 'reveal') return json({ error: 'Sonraki turu oda sahibi başlatır.' }, 403);
        if (r.round + 1 >= r.rounds) r.state = 'finished';
        else {
          r.round++;
          r.state = 'playing';
          r.guesses = {};
          delete r.results;
          r.deadline = Date.now() + (r.guessSeconds || 30) * 1000;
        }
      }
      if (action === 'close') {
        if (r.host !== token) return json({ error: 'Odayı yalnızca oda sahibi kapatabilir.' }, 403);
        r.state = 'closed';
        r.closedAt = Date.now();
      }
      if (action === 'leave') {
        if (r.host === token) return json({ error: 'Oda sahibi odayı kapatarak ayrılabilir.' }, 409);
        r.players = r.players.filter(p => p.token !== token);
        if (r.results) r.results = r.results.filter(x => x.id !== player.id);
        delete r.guesses[player.id];
        if (r.state === 'playing' && Object.keys(r.guesses).length === r.players.length) revealRound(r, cars);
      }
      if (!['join', 'start', 'restart', 'guess', 'next', 'get', 'close', 'leave'].includes(action)) return json({ error: 'Geçersiz işlem' }, 400);
      const changes = [];
      if (reserve) {
        for (const p of r.players) changes.push(env.DB.prepare("INSERT INTO listing_reservations(token,listing_id,room_code,expires_at) SELECT ?,json_extract(value,'$.id'),?,? FROM json_each(?) WHERE EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)").bind(p.token, code, r.expiresAt, JSON.stringify(r.order.map(index => ({ id: r.customCars[index][11].id }))), code, row.version));
      }
      if (reserve || (action === 'next' && r.state === 'playing')) {
        const listingId = (r.customCars || []).concat(cars)[r.order[r.round]][11].id;
        for (const p of r.players) changes.push(env.DB.prepare("INSERT INTO listing_history(token,listing_id,room_code,round_number,seen_at,seen_count) SELECT ?,?,?,?,?,1 WHERE EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?) ON CONFLICT(token,listing_id) DO UPDATE SET room_code=excluded.room_code,round_number=excluded.round_number,seen_at=excluded.seen_at,seen_count=listing_history.seen_count+1").bind(p.token, listingId, code, r.round, Date.now(), code, row.version));
      }
      if (action === 'close' || r.state === 'finished') changes.push(env.DB.prepare('DELETE FROM listing_reservations WHERE room_code=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)').bind(code, code, row.version));
      if (action === 'leave') changes.push(env.DB.prepare('DELETE FROM listing_reservations WHERE room_code=? AND token=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)').bind(code, token, code, row.version));
      const statement = env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(r), code, row.version);
      let update;
      try {
        if (changes.length) {
          const result = await env.DB.batch([...changes, statement]);
          update = result[result.length - 1];
        } else update = await statement.run();
      } catch (error) {
        if (reserve && /UNIQUE constraint/i.test(String(error.message))) continue;
        throw error;
      }
      if (!update.meta.changes) continue;
      if (actionError) return json({ error: actionError }, 409);
      if (action === 'close') return json({ closed: true });
      if (action === 'leave') return json({ left: true });
      return json(view(r, token, cars));
    }
    return json({ error: 'Oda yoğun, tekrar dene.' }, 409);
  };
}
