import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { createDB } from './test-db.mjs';
const DB = createDB();
const rows = {
  get(code) {
    return DB.sqlite.prepare('SELECT data,version FROM rooms WHERE code=?').get(code);
  },
  get size() {
    return DB.sqlite.prepare('SELECT count(*) n FROM rooms').get().n;
  },
};
let collisions = 0;
async function call(action, token, extra = {}) {
  const res = await worker.fetch(
    new Request('http://localhost/api/room', {
      method: 'POST',
      body: JSON.stringify({ action, token, ...extra }),
    }),
    { DB }
  );
  return { status: res.status, data: await res.json() };
}
const profile = { name: 'Ogz', avatar: 'a0' },
  guest = { name: 'Ece', avatar: 'a1' },
  config = { rounds: 10, mode: 'car-price', guessSeconds: 30, profile },
  a = crypto.randomUUID(),
  b = crypto.randomUUID();
collisions = 1;
let r = await call('create', a, config);
assert.equal(r.status, 200);
const code = r.data.code;
assert.match(code, /^[A-F0-9]{6}$/);
assert.equal(r.data.mode, 'car-price');
assert.equal(r.data.guessSeconds, 30);
assert.ok(!r.data.host);
assert.ok(!JSON.stringify(r.data).includes(a));
for (const profile of [
  undefined,
  {},
  { name: ' ', avatar: 'a0' },
  { name: 'Test' },
  { name: 'Test', avatar: 'invalid' },
]) {
  assert.equal((await call('create', crypto.randomUUID(), { ...config, profile })).status, 400);
  assert.equal((await call('join', crypto.randomUUID(), { code, profile })).status, 400);
}
for (const invalid of [
  { mode: 'other' },
  { guessSeconds: -1 },
  { guessSeconds: 81 },
  { guessSeconds: 121 },
  { guessSeconds: 12.5 },
  { rounds: 12 },
])
  assert.equal((await call('create', a, { ...config, ...invalid })).status, 400);
assert.equal(rows.size, 1);
r = await call('join', b, { code, profile: guest });
assert.equal(r.data.players.length, 2);
assert.equal((await call('start', b, { code })).status, 403);
assert.equal((await call('close', b, { code })).status, 403);
r = await call('start', a, { code });
assert.equal(r.data.state, 'playing');
assert.ok(r.data.deadline > Date.now());
assert.ok(!r.data.price);
assert.equal(r.data.car.length, 11);
assert.equal(r.data.car[10].source, 'user');
assert.ok(r.data.car[10].damageImage.startsWith('/media/'));
r = await call('guess', a, { code, guess: 2000000 });
assert.equal(r.data.hasGuessed, true);
assert.ok(!r.data.guesses);
assert.ok(!r.data.price);
assert.equal((await call('guess', a, { code, guess: 10 })).status, 409);
r = await call('guess', b, { code, guess: 2000000 });
assert.equal(r.data.state, 'reveal');
assert.ok(r.data.price > 0);
assert.equal(r.data.results[0].points, r.data.results[1].points);
for (let i = 1; i < 10; i++) {
  r = await call('next', a, { code });
  assert.equal(r.data.round, i);
  await call('guess', a, { code, guess: 1000000 });
  await call('guess', b, { code, guess: 1000000 });
}
r = await call('next', a, { code });
assert.equal(r.data.state, 'lobby');
assert.ok(r.data.lastGame);
assert.equal((await call('close', a, { code })).status, 200);
assert.equal((await call('join', b, { code, profile: guest })).status, 410);
assert.equal((await call('get', b, { code })).data.closed, true);
// A server deadline, not the browser clock, closes a round. Missing guesses score zero.
r = await call('create', a, { ...config, guessSeconds: 12 });
assert.equal(r.data.guessSeconds, 12);
const timed = r.data.code;
assert.notEqual(timed, code);
await call('join', b, { code: timed, profile: guest });
r = await call('start', a, { code: timed });
await call('guess', a, { code: timed, guess: 1500000 });
const actualNow = Date.now;
Date.now = () => r.data.deadline + 1;
assert.equal((await call('guess', b, { code: timed, guess: 2000000 })).status, 409);
let state = await call('get', a, { code: timed });
assert.equal(state.data.state, 'reveal');
assert.equal(
  state.data.results.find(x => x.id === state.data.players.find(p => p.name === 'Ece').id).points,
  0
);
assert.equal(state.data.results.find(x => x.guess === null).guess, null);
const score = state.data.players[0].score;
assert.equal((await call('get', a, { code: timed })).data.players[0].score, score);
Date.now = actualNow;
// Leaving never blocks the remaining players, and only the owner can invalidate the code.
await call('leave', b, { code: timed });
assert.equal((await call('get', a, { code: timed })).data.players.length, 1);
await call('close', a, { code: timed });
assert.equal((await call('start', a, { code: timed })).status, 410);
r = await call('create', a, config);
const stale = r.data.code;
Date.now = () => r.data.expiresAt + 1;
assert.equal((await call('join', b, { code: stale, profile: guest })).status, 410);
Date.now = actualNow;
// Simultaneous deadlines must award scores only once.
r = await call('create', a, config);
const concurrent = r.data.code;
await call('start', a, { code: concurrent });
let stored = JSON.parse(rows.get(concurrent).data);
Date.now = () => stored.deadline + 1;
const reads = await Promise.all([
  call('get', a, { code: concurrent }),
  call('get', a, { code: concurrent }),
]);
assert.ok(reads.every(x => x.data.state === 'reveal'));
assert.equal(JSON.parse(rows.get(concurrent).data).results.length, 1);
Date.now = actualNow;
for (const guessSeconds of [0, 1, 10, 11, 31, 79, 80])
  assert.equal(
    (await call('create', a, { ...config, guessSeconds })).data.guessSeconds,
    guessSeconds
  );
// Zero is an untimed price round: no implicit 30s fallback, no clock expiration.
const untimedHost=crypto.randomUUID(),untimedGuest=crypto.randomUUID();
let untimed=await call('create',untimedHost,{...config,guessSeconds:0});
const untimedCode=untimed.data.code;
await call('join',untimedGuest,{code:untimedCode,profile:guest});
assert.equal((await call('change-mode',untimedGuest,{...config,code:untimedCode,gameId:untimed.data.gameId,guessSeconds:0})).status,403);
untimed=await call('change-mode',untimedHost,{...config,code:untimedCode,gameId:untimed.data.gameId,guessSeconds:0});
assert.equal(untimed.status,200);assert.equal(untimed.data.guessSeconds,0);
untimed=await call('start',untimedHost,{code:untimedCode});assert.equal(untimed.data.deadline,null);
Date.now=()=>actualNow()+3600000;
try{assert.equal((await call('get',untimedGuest,{code:untimedCode})).data.state,'playing')}finally{Date.now=actualNow}
for(let round=0;round<10;round++){
 assert.equal((await call('guess',untimedHost,{code:untimedCode,guess:100})).data.state,'playing');
 assert.equal((await call('guess',untimedGuest,{code:untimedCode,guess:200})).data.state,'reveal');
 untimed=await call('next',untimedHost,{code:untimedCode});
 if(round<9)assert.equal(untimed.data.deadline,null);
}
untimed=await call('restart',untimedHost,{code:untimedCode});assert.equal(untimed.data.guessSeconds,0);assert.equal(untimed.data.deadline,null);
console.log('PASS: 0–80 second boundaries, host-only untimed settings, no deadline expiration, all-player reveal, subsequent rounds and untimed restart.');
const html = await (await worker.fetch(new Request('http://localhost/'), {})).text();
new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert.ok(html.includes('Tur başına tahmin süresi'));
assert.ok(html.includes('Oyun modu'));
console.log(
  'PASS: required profiles, mode/time validation, codes, host controls, 10 rounds, deadlines, zero points, single scoring under concurrent polling, leave, close, invalidated codes, expiration, browser syntax.'
);
