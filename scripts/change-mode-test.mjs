import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { createDB } from './test-db.mjs';
const DB = createDB(),
  env = { DB },
  host = crypto.randomUUID(),
  guest = crypto.randomUUID(),
  third = crypto.randomUUID();
let code;
const profile = name => ({ name, avatar: 'a1' });
async function call(action, extra = {}, token = host) {
  const response = await worker.fetch(
    new Request('https://game.test/api/room', {
      method: 'POST',
      body: JSON.stringify({ action, token, code, ...extra }),
    }),
    env
  );
  return { status: response.status, ...(await response.json()) };
}
const read = () =>
  JSON.parse(DB.sqlite.prepare('SELECT data FROM rooms WHERE code=?').get(code).data);
const options = { mode: 'product-price', categories: ['market'], rounds: 10, guessSeconds: 60 };
for (let n = 0; n < 12; n++) {
  const item = {
    id: 'switch-product-' + n,
    name: 'Ürün ' + n,
    category: 'market',
    price: 100 + n,
    image: '/media/product-' + n + '.jpg',
  };
  DB.sqlite
    .prepare('INSERT INTO products(id,data,created_at) VALUES(?,?,?)')
    .run(item.id, JSON.stringify(item), n);
}
const first = await call('create', {
  mode: 'car-price',
  rounds: 10,
  guessSeconds: 30,
  profile: profile('Host'),
});
code = first.code;
await call('join', { profile: profile('Guest') }, guest);
const identity = read().players.map(({ score, ...p }) => p);
assert.equal((await call('change-mode', { ...options, gameId: first.gameId }, guest)).status, 403);
assert.equal((await call('change-mode', { ...options, gameId: 'stale' })).status, 409);
assert.equal(
  (await call('change-mode', { ...options, mode: 'invalid', gameId: first.gameId })).status,
  400
);
await call('start');
assert.equal((await call('change-mode', { ...options, gameId: read().gameId })).status, 409);
async function finishGuess() {
  for (let i = 0; i < 10; i++) {
    const r = read(),
      price = r.customCars[r.order[r.round]][6];
    await call('guess', { gameId: r.gameId, guess: price });
    await call('guess', { gameId: r.gameId, guess: price }, guest);
    await call('next', { gameId: r.gameId });
  }
  assert.equal(read().state, 'lobby');
  assert.ok(read().lastGame);
}
await finishGuess();
const oldGame = read().gameId;
assert.equal(
  (await call('change-mode', { ...options, categories: [], gameId: oldGame })).status,
  400
);
const switched = await call('change-mode', { ...options, gameId: oldGame });
assert.equal(switched.status, 200);
assert.equal(switched.code, code);
assert.equal(switched.state, 'lobby');
assert.equal(switched.mode, 'product-price');
assert.equal(switched.guessSeconds, 60);
assert.notEqual(switched.gameId, oldGame);
assert.ok(switched.players.every(p => p.score === 0));
assert.equal(switched.price, undefined);
assert.equal(switched.car, undefined);
assert.equal(switched.results, undefined);
assert.equal(switched.deadline, undefined);
assert.deepEqual(
  read().players.map(({ score, ...p }) => p),
  identity
);
assert.equal((await call('get', {}, guest)).mode, 'product-price');
assert.equal(DB.sqlite.prepare('SELECT count(*) n FROM rooms').get().n, 1);
assert.equal(
  DB.sqlite.prepare('SELECT count(*) n FROM listing_reservations WHERE room_code=?').get(code).n,
  0
);
assert.equal((await call('change-mode', { ...options, gameId: oldGame })).status, 409);
let started = await call('start');
assert.equal(started.car[10].kind, 'product');
assert.equal((await call('guess', { gameId: oldGame, guess: 100 })).status, 409);
await finishGuess();
assert.equal(read().players.length, 2);
const auction = await call('change-mode', {
  mode: 'auction',
  category: 'gun-tabagi',
  gameId: read().gameId,
});
assert.equal(auction.status, 200);
assert.equal(auction.code, code);
assert.equal(auction.state, 'lobby');
assert.ok(auction.players.every(p => p.balance === 20 && p.plate.length === 0));
assert.equal(auction.guesses, undefined);
assert.equal(auction.customCars, undefined);
started = await call('start');
assert.equal(started.state, 'playing');
for (let i = 0; i < 12 && read().state !== 'lobby'; i++) {
  let r = await call('get');
  if (r.state === 'playing' && r.choice) {
    const chooser = read().players.find(p => p.id === r.choice.playerId).token;
    await call('choose', { gameId: r.gameId, round: r.round, decision: 'keep' }, chooser);
  } else if (r.state === 'playing') {
    const owner = r.players[r.round % 2].id;
    const bidder = read().players.find(p => p.id === owner).token;
    const other = bidder === host ? guest : host;
    await call('bid', { gameId: r.gameId, round: r.round, amount: r.item.startPrice || 1 }, bidder);
    await call('pass', { gameId: r.gameId, round: r.round }, other);
  }
  r = await call('get');
  if (r.state === 'reveal') await call('next', { gameId: r.gameId, round: r.round });
}
assert.equal(read().state, 'lobby');
assert.ok(read().lastGame);
const auctionId = read().gameId;
const car = await call('change-mode', {
  mode: 'car-price',
  rounds: 15,
  guessSeconds: 45,
  gameId: auctionId,
});
assert.equal(car.status, 200);
assert.equal(car.mode, 'car-price');
assert.equal(car.rounds, 15);
assert.equal(car.state, 'lobby');
assert.equal(car.sales, undefined);
assert.equal(car.items, undefined);
assert.ok(car.players.every(p => p.balance === undefined && p.plate === undefined));
assert.deepEqual(
  read().players.map(({ score, ...p }) => p),
  identity
);
await call('join', { profile: profile('Third') }, third);
assert.equal(read().players.length, 3);
const before = JSON.stringify(read());
assert.equal(
  (await call('change-mode', { mode: 'auction', category: 'gun-tabagi', gameId: read().gameId }))
    .status,
  409
);
assert.equal(JSON.stringify(read()), before);
assert.equal(
  (await call('change-mode', { mode: 'auction', category: 'invalid', gameId: read().gameId }))
    .status,
  409
);
await call('close');
assert.equal((await call('change-mode', { ...options, gameId: read().gameId })).status, 410);
const html = await (await worker.fetch(new Request('https://game.test/'), {})).text();
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert.ok(html.includes('Farklı oyun seç'));
assert.ok(html.includes("enterRoom(\\'"));
console.log(
  'PASS: same-room car → products → auction → car, identities retained, clean state, guest polling, host-only mode changes, stale actions, player limits, invalid options and closed rooms.'
);
