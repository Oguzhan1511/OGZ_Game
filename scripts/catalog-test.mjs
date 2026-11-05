import assert from 'node:assert/strict';
import fs from 'node:fs';
import { cars } from '../worker/modes/car/catalog.js';
import { mediaManifest } from '../worker/modes/car/media-manifest.js';
import { selectListings } from '../worker/selection.js';
import { createDB } from './test-db.mjs';
import worker from '../worker/index.js';
const actual = cars.filter(c => c[11]?.source === 'user');
assert.equal(actual.length, 82);
assert.equal(new Set(actual.map(c => c[11].id)).size, 82);
for (const c of actual)
  for (const path of [c[10], c[11].damageImage])
    assert.equal(
      fs.statSync('assets/listings/' + path.split('/').pop()).size,
      mediaManifest[path].size
    );
for (const rounds of [10, 15, 20])
  for (let n = 0; n < 500; n++) {
    const s = selectListings(cars, rounds);
    assert.equal(s.order.length, rounds);
    const rows = s.order.map(i => cars[i]);
    assert.equal(new Set(rows.map(c => c[11].id)).size, rounds);
    assert.equal(new Set(rows.map(c => c[11].family)).size, rounds);
    assert.equal(new Set(rows.map(c => c[0])).size, rounds);
    for (let i = 1; i < rows.length; i++) assert.notEqual(rows[i][0], rows[i - 1][0]);
  }
assert.ok(selectListings(cars, 10, new Set(actual.map(c => c[11].id))).error);
const DB = createDB(),
  token = crypto.randomUUID(),
  profile = { name: 'Tester', avatar: 'a0' };
async function api(action, code, extra = {}) {
  const r = await worker.fetch(
    new Request('http://local/api/room', {
      method: 'POST',
      body: JSON.stringify({ action, code, token, ...extra }),
    }),
    { DB }
  );
  return { status: r.status, ...(await r.json()) };
}
const make = () =>
  api('create', undefined, { profile, mode: 'car-price', rounds: 10, guessSeconds: 12 });
const first = await make();
const started = await api('start', first.code);
assert.equal(started.state, 'playing');
const firstID = started.car[10].id;
const reserved = DB.sqlite
  .prepare('SELECT listing_id FROM listing_reservations')
  .all()
  .map(x => x.listing_id);
assert.equal(reserved.length, 10);
const second = await make();
assert.equal((await api('start', second.code)).state, 'playing');
const reserved2 = DB.sqlite
  .prepare('SELECT listing_id FROM listing_reservations WHERE room_code=?')
  .all(second.code)
  .map(x => x.listing_id);
assert.ok(reserved2.every(id => !reserved.includes(id)));
await api('close', first.code);
const retained = DB.sqlite
  .prepare('SELECT * FROM listing_history WHERE room_code=?')
  .all(first.code);
assert.equal(retained.length, 1);
assert.equal(retained[0].listing_id, firstID);
assert.ok(retained[0].seen_at);
await api('close', second.code);
const third = await make();
const thirdState = await api('start', third.code);
assert.ok(thirdState.car[10].id);
assert.ok(!JSON.stringify(thirdState).includes('"price":'));
await api('close', third.code);
for (const c of actual)
  DB.sqlite
    .prepare(
      'INSERT OR IGNORE INTO listing_history(token,listing_id,room_code,round_number,seen_at) VALUES(?,?,?,?,?)'
    )
    .run(token, c[11].id, 'OLD', 0, Date.now());
const exhausted = await make();
assert.equal((await api('start', exhausted.code)).state, 'playing');
assert.equal(
  DB.sqlite
    .prepare('SELECT count(*) n FROM listing_reservations WHERE room_code=?')
    .get(exhausted.code).n,
  10
);
const objects = new Map();
const env = {
  ASSET_UPLOAD_KEY: 'test-only',
  BUCKET: {
    async put(k, b) {
      objects.set(k, b);
    },
    async get(k) {
      return objects.has(k) ? { body: objects.get(k) } : null;
    },
  },
};
const [path, meta] = Object.entries(mediaManifest)[0],
  bytes = fs.readFileSync('assets/listings/' + path.split('/').pop());
assert.equal(
  (await worker.fetch(new Request('http://local/api' + path, { method: 'PUT', body: bytes }), env))
    .status,
  403
);
assert.equal(
  (
    await worker.fetch(
      new Request('http://local/api' + path, {
        method: 'PUT',
        headers: { authorization: 'Bearer test-only' },
        body: bytes,
      }),
      env
    )
  ).status,
  200
);
const image = await worker.fetch(new Request('http://local' + path), env);
assert.equal(image.headers.get('content-type'), meta.type);
assert.equal((await image.arrayBuffer()).byteLength, meta.size);
assert.equal(
  (
    await worker.fetch(
      new Request('http://local/api' + path, {
        method: 'PUT',
        headers: { authorization: 'Bearer test-only' },
        body: 'bad',
      }),
      env
    )
  ).status,
  400
);
console.log(
  'PASS: 82 unique listings, 164 assets, 1,500 diverse selections, persistent seen history, concurrent room reservations, release on close, replay after exhaustion, hidden prices, authenticated hash-checked media storage.'
);

const seeded = () => {
  let n = 24;
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
};
for (const rounds of [10, 15, 20]) {
  const seen = new Map(
    actual.slice(0, 25).map((c, i) => [c[11].id, { seenCount: 1, lastSeen: i }])
  );
  const chosen = selectListings(cars, rounds, new Set(), seeded(), seen);
  assert.ok(chosen.repeated <= Math.max(1, Math.floor(rounds * 0.1)));
  assert.equal(new Set(chosen.order.map(i => cars[i][11].id)).size, rounds);
}
const allSeen = new Map(actual.map((c, i) => [c[11].id, { seenCount: 1, lastSeen: i }]));
for (let n = 0; n < 100; n++) {
  const chosen = selectListings(cars, 20, new Set(), Math.random, allSeen);
  assert.equal(chosen.order.length, 20);
  assert.equal(new Set(chosen.order).size, 20);
}
const mostlySeen = new Map(
  actual.slice(0, -3).map((c, i) => [c[11].id, { seenCount: 1, lastSeen: i }])
);
assert.equal(selectListings(cars, 10, new Set(), seeded(), mostlySeen).repeated, 7);
console.log(
  'PASS: mostly unseen games, bounded occasional repeats, depleted-pool replay, unique round listings.'
);
const mixed = [];
for (let n = 0; n < 12; n++)
  for (let variant = 0; variant < 2; variant++) {
    const c = structuredClone(actual[0]);
    c[0] = n % 2 ? 'BMW' : 'Mercedes-Benz';
    c[11] = {
      ...c[11],
      id: 'mixed-' + n + '-' + variant,
      family: c[0] + ' / Model ' + n,
      vehicleType: n % 4 < 2 ? 'automobile' : 'suv',
    };
    mixed.push(c);
  }
for (let n = 0; n < 100; n++) {
  const s = selectListings(mixed, 10);
  assert.equal(s.order.length, 10);
  const rows = s.order.map(i => mixed[i]);
  assert.equal(new Set(rows.map(c => c[11].family)).size, 10);
  assert.equal(new Set(rows.map(c => c[11].vehicleType)).size, 2);
  assert.ok(rows.filter(c => c[0] === 'BMW').length > 1);
  assert.ok(rows.filter(c => c[0] === 'Mercedes-Benz').length > 1);
}
assert.ok(selectListings(mixed, 15).error);
console.log(
  'PASS: mixed automobile/SUV rounds, repeated brands allowed, model variants excluded within each game.'
);
