import { returnToLobby } from '../../room-lifecycle.js';
export const battleShipTypes = [
  { id: 'carrier', name: 'Uçak Gemisi', length: 5 },
  { id: 'battleship', name: 'Zırhlı', length: 4 },
  { id: 'cruiser', name: 'Kruvazör', length: 3 },
  { id: 'submarine', name: 'Denizaltı', length: 3 },
  { id: 'destroyer', name: 'Muhrip', length: 2 },
];
export function battleshipState() {
  return {
    battle: {
      phase: 'placement',
      turnPlayerId: null,
      turnId: crypto.randomUUID(),
      lastShot: null,
    },
    startedAt: null,
    round: 0,
  };
}
export function battleCells(ship) {
  const type = battleShipTypes.find(s => s.id === ship.id);
  return type
    ? Array.from(
        { length: type.length },
        (_, i) => ship.row * 10 + ship.col + i * (ship.vertical ? 10 : 1)
      )
    : [];
}
export function validateBattleFleet(fleet) {
  if (!Array.isArray(fleet) || fleet.length !== 5) return null;
  const ids = new Set(),
    occupied = new Set(),
    clean = [];
  for (const ship of fleet) {
    if (
      !ship ||
      !battleShipTypes.some(s => s.id === ship.id) ||
      ids.has(ship.id) ||
      !Number.isInteger(ship.row) ||
      !Number.isInteger(ship.col) ||
      ship.row < 0 ||
      ship.col < 0 ||
      typeof ship.vertical !== 'boolean'
    )
      return null;
    const type = battleShipTypes.find(s => s.id === ship.id);
    if (
      ship.row + (ship.vertical ? type.length : 1) > 10 ||
      ship.col + (ship.vertical ? 1 : type.length) > 10
    )
      return null;
    const normalized = {
      id: ship.id,
      row: ship.row,
      col: ship.col,
      vertical: ship.vertical,
    };
    for (const cell of battleCells(normalized)) {
      if (occupied.has(cell)) return null;
      occupied.add(cell);
    }
    ids.add(ship.id);
    clean.push(normalized);
  }
  return clean;
}
function battleSunk(fleet, shots) {
  return fleet.filter(ship => battleCells(ship).every(i => shots.includes(i)));
}
function battlePublicShots(shooter, target) {
  const sunk = battleSunk(target.fleet || [], shooter.shots || []),
    sunkCells = new Set(sunk.flatMap(battleCells)),
    occupied = new Set((target.fleet || []).flatMap(battleCells));
  return (shooter.shots || []).map(index => ({
    index,
    hit: occupied.has(index),
    sunk: sunkCells.has(index),
  }));
}
function battleFleetStatus(player, attacker) {
  const shots = new Set(attacker?.shots || []);
  return battleShipTypes.map(type => {
    const ship = (player.fleet || []).find(s => s.id === type.id);
    const hits = ship ? battleCells(ship).filter(i => shots.has(i)).length : 0;
    return { id: type.id, hits, status: hits === type.length ? 'sunk' : hits ? 'damaged' : 'intact' };
  });
}
function battleshipView(r, token) {
  const me = r.players.find(p => p.token === token),
    enemy = r.players.find(p => p.id !== me?.id);
  return {
    code: r.code,
    mode: 'battleship',
    state: r.state,
    gameId: r.gameId,
    isHost: r.host === token,
    me: me?.id,
    serverNow: Date.now(),
    battleVersion: r.battleVersion || 0,
    round: r.round,
    startedAt: r.startedAt,
    players: r.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      ready: !!p.ready,
      score: p.score || 0,
      fleetStatus: battleFleetStatus(p, r.players.find(other => other.id !== p.id)),
      remaining: p.fleet?.length
        ? 5 - battleSunk(p.fleet, r.players.find(other => other.id !== p.id)?.shots || []).length
        : 5,
    })),
    battle: {
      ...r.battle,
      myFleet: me?.fleet || [],
      incoming: enemy ? battlePublicShots(enemy, me) : [],
      outgoing: me && enemy ? battlePublicShots(me, enemy) : [],
      sunkEnemy: enemy ? battleSunk(enemy.fleet || [], me?.shots || []) : [],
    },
    lastGame: r.lastGame,
  };
}
function battleshipFinish(r, winner) {
  const now = Date.now(),
    result = {
      mode: 'battleship',
      finishedAt: now,
      winnerId: winner.id,
      totalShots: r.round,
      gameId: r.gameId,
      lastShot: r.battle.lastShot,
      elapsedMs: now - r.startedAt,
      players: r.players.map(p => {
        const other = r.players.find(q => q.id !== p.id),
          hits = battlePublicShots(p, other).filter(s => s.hit).length;
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: hits,
          fleet: p.fleet,
          shots: battlePublicShots(p, other),
          remaining: 5 - battleSunk(p.fleet, other.shots).length,
        };
      }),
    };
  returnToLobby(r);
  r.lastGame = result;
  Object.assign(r, battleshipState());
  r.players.forEach(p => {
    p.fleet = [];
    p.shots = [];
    p.ready = false;
    p.score = 0;
  });
}
export async function battleshipApi(b, env) {
  const reply = (v, status = 200) =>
      Response.json(v, { status, headers: { 'cache-control': 'no-store' } }),
    token = b.token;
  if (b.action === 'create') {
    for (let i = 0; i < 8; i++) {
      const r = {
        code: crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase(),
        host: token,
        mode: 'battleship',
        state: 'lobby',
        gameId: crypto.randomUUID(),
        expiresAt: Date.now() + 86400000,
        players: [
          {
            ...b.profile,
            token,
            id: crypto.randomUUID(),
            fleet: [],
            shots: [],
            ready: false,
            score: 0,
          },
        ],
        ...battleshipState(),
      };
      const out = await env.DB.prepare(
        'INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)'
      )
        .bind(r.code, JSON.stringify(r), Date.now())
        .run();
      if (out.meta.changes) return reply(battleshipView(r, token));
    }
    return reply({ error: 'Oda oluşturulamadı.' }, 503);
  }
  const code = String(b.code || '')
    .trim()
    .toUpperCase();
  if (!/^[A-F0-9]{6}$/.test(code)) return reply({ error: 'Geçerli oda kodu gir.' }, 400);
  for (let retry = 0; retry < 8; retry++) {
    const row = await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?')
      .bind(code)
      .first();
    if (!row) return reply({ error: 'Oda bulunamadı.', closed: true }, 404);
    const r = JSON.parse(row.data);
    if (r.mode !== 'battleship') return reply({ error: 'Geçersiz oyun modu.' }, 400);
    if (r.state === 'closed' || Date.now() >= r.expiresAt)
      return reply({ error: 'Oda kapatıldı.', closed: true }, 410);
    const player = r.players.find(p => p.token === token);
    if (!player && b.action !== 'join') return reply({ error: 'Önce odaya katıl.' }, 403);
    if (['start', 'place-fleet', 'fire'].includes(b.action) && b.gameId && b.gameId !== r.gameId)
      return reply({ error: 'Oyun değişti. Güncel odada tekrar dene.' }, 409);
    let changed = false,
      error = null;
    if (b.action === 'join' && !player) {
      if (r.state !== 'lobby' || r.players.length >= 2)
        return reply({ error: 'Amiral Battı iki kişilik. Oda dolu veya oyun başladı.' }, 409);
      r.players.push({
        ...b.profile,
        token,
        id: crypto.randomUUID(),
        fleet: [],
        shots: [],
        ready: false,
        score: 0,
      });
      changed = true;
    } else if (b.action === 'start') {
      if (r.host !== token || r.state !== 'lobby')
        return reply({ error: 'Oyunu lobide yalnızca oda sahibi başlatabilir.' }, 403);
      if (r.players.length !== 2)
        return reply({ error: 'Amiral Battı için iki oyuncu gerekli.' }, 409);
      Object.assign(r, battleshipState());
      r.gameId = crypto.randomUUID();
      r.state = 'playing';
      r.players.forEach(p => {
        p.fleet = [];
        p.shots = [];
        p.ready = false;
        p.score = 0;
      });
      r.expiresAt = Date.now() + 86400000;
      changed = true;
    } else if (b.action === 'place-fleet') {
      if (r.state !== 'playing' || r.battle.phase !== 'placement' || player.ready)
        error = 'Filo yerleşimi kilitlendi.';
      else {
        const fleet = validateBattleFleet(b.fleet);
        if (!fleet) error = '5 gemiyi taşmadan ve üst üste gelmeden yerleştir.';
        else {
          player.fleet = fleet;
          player.ready = true;
          changed = true;
          if (r.players.every(p => p.ready)) {
            r.battle.phase = 'battle';
            r.battle.turnPlayerId = r.players[0].id;
            r.battle.turnId = crypto.randomUUID();
            r.startedAt = Date.now();
          }
        }
      }
    } else if (b.action === 'fire') {
      if (r.state !== 'playing' || r.battle.phase !== 'battle')
        error = 'Önce iki oyuncu da filosunu hazırlamalı.';
      else if (r.battle.turnPlayerId !== player.id) error = 'Ateş sırası rakibinde.';
      else if (b.turnId !== r.battle.turnId) error = 'Atış sırası güncellendi. Tekrar nişan al.';
      else if (!Number.isInteger(b.index) || b.index < 0 || b.index >= 100)
        error = 'Tahtada bir kare seç.';
      else if (player.shots.includes(b.index)) error = 'Bu kareye zaten ateş ettin.';
      else {
        const enemy = r.players.find(p => p.id !== player.id),
          ship = enemy.fleet.find(s => battleCells(s).includes(b.index));
        player.shots.push(b.index);
        r.round++;
        player.score = battlePublicShots(player, enemy).filter(s => s.hit).length;
        const sunk = ship && battleCells(ship).every(i => player.shots.includes(i));
        r.battle.lastShot = {
          id: crypto.randomUUID(),
          playerId: player.id,
          index: b.index,
          hit: !!ship,
          sunk: !!sunk,
          shipName: sunk ? battleShipTypes.find(t => t.id === ship.id).name : null,
        };
        r.battle.turnPlayerId = ship ? player.id : enemy.id;
        r.battle.turnId = crypto.randomUUID();
        changed = true;
        if (battleSunk(enemy.fleet, player.shots).length === 5) battleshipFinish(r, player);
      }
    } else if (b.action === 'close' || b.action === 'leave') {
      if (b.action === 'close' && r.host !== token)
        return reply({ error: 'Odayı yalnızca oda sahibi kapatabilir.' }, 403);
      if (b.action === 'leave' && r.state === 'lobby' && r.host !== token)
        r.players = r.players.filter(p => p.token !== token);
      else r.state = 'closed';
      changed = true;
    } else if (!['get', 'join'].includes(b.action)) error = 'Geçersiz işlem.';
    if (error) return reply({ error }, 409);
    if (changed) {
      r.battleVersion = (r.battleVersion || 0) + 1;
      const saved = await env.DB.prepare(
        'UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?'
      )
        .bind(JSON.stringify(r), code, row.version)
        .run();
      if (!saved.meta.changes) continue;
    }
    if (r.state === 'closed') return reply({ closed: true });
    if (b.action === 'leave') return reply({ left: true });
    return reply(battleshipView(r, token));
  }
  return reply({ error: 'Oyun güncelleniyor. Tekrar dene.' }, 409);
}
