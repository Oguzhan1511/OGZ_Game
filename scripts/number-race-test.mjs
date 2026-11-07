import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { createDB } from './test-db.mjs';
for (const size of [4, 6, 10]) {
  const DB = createDB(),
    env = { DB },
    a = crypto.randomUUID(),
    b = crypto.randomUUID(),
    outsider = crypto.randomUUID();
  let code, r;
  async function call(action, token = a, extra = {}, expected = 200) {
    const res = await worker.fetch(
      new Request('https://test/api/room', {
        method: 'POST',
        body: JSON.stringify({ action, token, code, gameId: r?.gameId, ...extra }),
      }),
      env
    );
    const data = await res.json();
    assert.equal(res.status, expected, data.error);
    if (expected === 200 && data.state) r = data;
    return data;
  }
  async function ready() {
    assert.equal(r.race.phase, 'ready');
    const saved = JSON.parse(
      DB.sqlite.prepare('SELECT data FROM rooms WHERE code=?').get(code).data
    );
    saved.race.startsAt = Date.now() - 1;
    saved.race.deadline = Date.now() + 20000;
    DB.sqlite.prepare('UPDATE rooms SET data=? WHERE code=?').run(JSON.stringify(saved), code);
    await call('get');
  }
  r = await call('create', a, {
    mode: 'number-race',
    gridSize: size,
    profile: { name: 'Ada', avatar: 'a1' },
  });
  code = r.code;
  assert.equal(r.state, 'lobby');
  assert.equal(r.gridSize, size);
  await call('start', a, {}, 409);
  await call('join', b, { profile: { name: 'Ece', avatar: 'a2' } });
  await call('join', outsider, { profile: { name: 'Can', avatar: 'a3' } }, 409);
  await call('start', b, {}, 403);
  await call('start');
  const firstGame = r.gameId,
    firstTurn = r.race.turnId,
    aid = r.players[0].id,
    bid = r.players[1].id;
  await call('pick-number', b, { turnId: firstTurn, number: 1 }, 409);
  await call('mark-cells', a, { turnId: firstTurn, cells: [0] }, 409);
  await call('pick-number', a, { turnId: firstTurn, number: size ** 2 + 1 }, 409);
  await call('pick-number', a, { turnId: firstTurn, number: size ** 2 });
  assert.equal(r.race.deadline - r.race.startsAt, 20000);
  assert.equal(r.race.phase, 'ready');
  await call('mark-cells', a, { turnId: firstTurn, cells: [0] }, 409);
  await ready();
  assert.equal(r.race.board.length, 0);
  let search = await call('get', b);
  const board = search.race.board;
  assert.equal(board.length, size ** 2);
  assert.equal(new Set(board).size, size ** 2);
  assert.ok(!JSON.stringify(search).includes(a));
  await call('mark-cells', b, { turnId: firstTurn, cells: [0] }, 409);
  await call('mark-cells', a, { turnId: firstTurn, cells: [-1] }, 409);
  await call('mark-cells', a, { turnId: firstTurn, cells: [0, 1, 1] });
  assert.equal(r.players[0].marks.length, 2);
  await call('mark-cells', a, { turnId: firstTurn, cells: [0, 1] });
  assert.equal(r.players[0].marks.length, 2);
  await call('find-number', b, { turnId: firstTurn, index: board.findIndex(n => n !== size ** 2) });
  assert.equal(r.round, 0);
  await call('find-number', b, { turnId: firstTurn, index: board.indexOf(size ** 2) });
  assert.equal(r.round,0);assert.equal(r.race.phase,'settling');assert.equal(r.race.chooserId,aid);
  await call('mark-cells', a, { turnId: firstTurn, cells: [2] }, 409);
  const ended = r.race.cutoffAt;
  await call(
    'mark-cells',
    a,
    { turnId: firstTurn, cells: [3], clicks: [{ index: 3, at: ended + 1 }] },
    200
  );
  await call('mark-cells', a, {
    turnId: firstTurn,
    cells: [2],
    clicks: [{ index: 2, at: Math.max(r.race.startsAt,ended - 1) }],
  });
  assert.equal(r.players[0].marks.length, 3);
  await call('mark-cells', a, {
    turnId: firstTurn,
    cells: [2],
    clicks: [{ index: 2, at: Math.max(r.race.startsAt,ended - 1) }],
  });
  assert.equal(r.players[0].marks.length, 3);
  await call('finish-marks',b,{turnId:firstTurn},409);
  await call('pick-number',b,{turnId:firstTurn,number:1},409);
  await call('finish-marks',a,{turnId:firstTurn});
  assert.equal(r.round,1);assert.equal(r.race.phase,'choose');assert.equal(r.race.chooserId,bid);assert.equal(r.race.lastTurn.reason,'found');
  await call('mark-cells',a,{turnId:firstTurn,cells:[3],clicks:[{index:3,at:ended}]},409);
  await call('finish-marks',a,{turnId:firstTurn});assert.equal(r.round,1);
  let turn = r.race.turnId;
  await call('pick-number', b, { turnId: turn, number: size ** 2 }, 409);
  await call('pick-number', b, { turnId: turn, number: 1 });
  await ready();
  search = await call('get', a);
  assert.notDeepEqual(search.race.board, board);
  // Server deadlines expire before late marking, and persist the role change even on a rejected action.
  const stored = JSON.parse(
    DB.sqlite.prepare('SELECT data FROM rooms WHERE code=?').get(code).data
  );
  stored.race.deadline = Date.now() - 1;
  DB.sqlite.prepare('UPDATE rooms SET data=? WHERE code=?').run(JSON.stringify(stored), code);
  await call('mark-cells', b, { turnId: turn, cells: [0] }, 409);
  await call('get');assert.equal(r.race.phase,'settling');assert.equal(r.round,1);
  const offline=JSON.parse(DB.sqlite.prepare('SELECT data FROM rooms WHERE code=?').get(code).data);offline.race.settleUntil=Date.now()-1;
  DB.sqlite.prepare('UPDATE rooms SET data=? WHERE code=?').run(JSON.stringify(offline),code);
  await call('get');
  assert.equal(r.round, 2);
  assert.equal(r.race.lastTurn.reason, 'timeout');
  assert.equal(r.players[1].marks.length, 0);
  assert.equal(r.race.chooserId, aid);
  turn = r.race.turnId;
  await call('pick-number', a, { turnId: turn, number: 2 });
  await ready();
  const pending = Array.from({ length: size ** 2 }, (_, i) => i).slice(2);
  const results = await Promise.all([
    call('mark-cells', a, { turnId: turn, cells: pending }),
    call('get', b),
  ]);
  await call('get');
  assert.equal(r.state, 'lobby');
  assert.equal(r.lastGame.mode, 'number-race');
  assert.equal(r.lastGame.winnerId, aid);
  assert.equal(r.lastGame.players[0].marks.length, size ** 2);
  assert.equal(r.lastGame.totalRounds, 3);
  assert.ok(r.players.every(p => p.marks.length === 0));
  assert.equal(r.lastGame.gridSize, size);
  await call('mark-cells', a, { turnId: turn, cells: [0], gameId: firstGame }, 409);
  await call('start');
  assert.notEqual(r.gameId, firstGame);
  assert.ok(r.players.every(p => p.marks.length === 0));
  // Return to lobby through finishing, then switch back to the existing price mode in the same room.
  await call('pick-number', a, { turnId: r.race.turnId, number: 1 });
  await ready();
  await call('mark-cells', a, {
    turnId: r.race.turnId,
    cells: Array.from({ length: size ** 2 }, (_, i) => i),
  });
  await call('change-mode', a, { mode: 'car-price', rounds: 10, guessSeconds: 30 });
  assert.equal(r.mode, 'car-price');
  assert.equal(r.state, 'lobby');
  assert.equal(r.players.length, 2);
  await call('close');
  console.log(
    'PASS:',
    size + '×' + size,
    'two-player roles, private shuffled board, 20s timeout, acknowledged turn settlement, late-mark cutoff, offline fallback, explicit marks, deduplication, stale turns, winner snapshot, replay and same-room mode switch.'
  );
}
const html = await (await worker.fetch(new Request('https://test'), {})).text();
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert.ok(html.includes('Sayı Yarışı · 2 kişi'));
assert.ok(html.includes('Hedef sayı seçimi'));
assert.ok(html.includes('HAZIRIM!'));
assert.ok(html.includes('Rastgele'));
assert.ok(!html.includes('onpointerenter="markNumberCell'));
assert.ok(!html.includes('onmouseover="markNumberCell'));
console.log('PASS: client syntax, lobby options and click-only mark controls.');
