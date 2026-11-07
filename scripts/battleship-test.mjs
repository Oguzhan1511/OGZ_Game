import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { createDB } from './test-db.mjs';
import {
  battleShipTypes,
  battleCells,
  validateBattleFleet,
} from '../worker/modes/battleship/battleship.js';
import { getBattleshipClient } from '../worker/modes/battleship/battleship-ui.js';
const fleet = battleShipTypes.map((s, i) => ({ id: s.id, row: i, col: 0, vertical: false })),
  otherFleet = battleShipTypes.map((s, i) => ({ id: s.id, row: i, col: 9, vertical: true }));
// Separated vertical ships, total fleet size 17.
otherFleet.forEach((s, i) => {
  s.row = 0;
  s.col = i * 2;
});
assert.equal(fleet.flatMap(battleCells).length, 17);
assert.deepEqual(validateBattleFleet(fleet), fleet);
assert.deepEqual(validateBattleFleet(otherFleet), otherFleet);
assert.equal(validateBattleFleet(fleet.slice(1)), null);
assert.equal(validateBattleFleet(fleet.map((s, i) => (i ? { ...s, row: 0 } : s))), null);
assert.equal(validateBattleFleet(fleet.map((s, i) => (i ? s : { ...s, col: 8 }))), null);
assert.equal(validateBattleFleet(fleet.map((s, i) => (i ? s : { ...s, id: 'invalid' }))), null);
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
await call('create', a, { mode: 'battleship', profile: { name: 'Ada', avatar: 'a1' } });
code = r.code;
await call('start', a, {}, 409);
await call('join', b, { profile: { name: 'Ece', avatar: 'a2' } });
await call('join', outsider, { profile: { name: 'Third', avatar: 'a3' } }, 409);
await call('start', b, {}, 403);
await call('start');
const firstGame = r.gameId,
  aid = r.players[0].id,
  bid = r.players[1].id;
await call('fire', a, { index: 0, turnId: r.battle.turnId }, 409);
await call('place-fleet', a, { fleet: fleet.slice(1) }, 409);
await call('place-fleet', a, { fleet });
assert.equal(r.battle.phase, 'placement');
assert.equal(r.players[0].ready, true);
await call('place-fleet', a, { fleet }, 409);
let guest = await call('get', b);
assert.deepEqual(guest.battle.myFleet, []);
assert.deepEqual(guest.battle.sunkEnemy, []);
assert.ok(!JSON.stringify(guest).includes(a));
assert.equal(guest.players[0].fleetStatus.length, 5);
assert.ok(guest.players[0].fleetStatus.every(s => Object.keys(s).sort().join(',') === 'hits,id,status'));
assert.ok(guest.players[0].fleetStatus.every(s => s.status === 'intact' && s.hits === 0));
await call('place-fleet', b, { fleet: otherFleet });
assert.equal(r.battle.phase, 'battle');
assert.equal(r.battle.turnPlayerId, aid);
await call('fire', b, { index: 99, turnId: r.battle.turnId }, 409);
await call('fire', a, { index: 100, turnId: r.battle.turnId }, 409);
let turn = r.battle.turnId;
const firstHit = battleCells(otherFleet[0])[0];
await call('fire', a, { index: firstHit, turnId: turn });
assert.equal(r.battle.lastShot.hit, true);
assert.deepEqual(r.players[1].fleetStatus.find(s => s.id === 'carrier'), { id: 'carrier', hits: 1, status: 'damaged' });
assert.ok(r.players[0].fleetStatus.every(s => s.status === 'intact'));
assert.equal(r.battle.turnPlayerId, aid);
assert.deepEqual(r.battle.sunkEnemy, []);
assert.equal(r.battle.outgoing[0].shipId, undefined);
await call('fire', a, { index: 1, turnId: turn }, 409);
await call('fire', a, { index: firstHit, turnId: r.battle.turnId }, 409);
await call('fire', a, { index: 99, turnId: r.battle.turnId });
assert.equal(r.battle.lastShot.hit, false);
assert.equal(r.battle.turnPlayerId, bid);
await call('fire', b, { index: 99, turnId: r.battle.turnId });
assert.equal(r.battle.turnPlayerId, aid);
// Concurrent requests cannot consume the same firing turn twice.
turn = r.battle.turnId;
const secondHit = battleCells(otherFleet[0])[1];
const statuses = await Promise.all([
  call('fire', a, { index: secondHit, turnId: turn }),
  call('fire', a, { index: secondHit, turnId: turn }, 409),
]);
await call('get', a);
assert.equal(r.battle.outgoing.filter(s => s.index === secondHit).length, 1);
for (const index of otherFleet
  .flatMap(battleCells)
  .filter(i => i !== firstHit && i !== secondHit)) {
  assert.equal(r.battle.turnPlayerId, aid);
  await call('fire', a, { index, turnId: r.battle.turnId });
  if (r.state !== 'lobby') {
    assert.equal(r.battle.lastShot.hit, true);
    if (r.battle.lastShot.sunk) {
      const sunk = r.players[1].fleetStatus.filter(s => s.status === 'sunk');
      assert.equal(sunk.length, r.battle.sunkEnemy.length);
      assert.ok(sunk.every(s => s.hits === battleShipTypes.find(t => t.id === s.id).length));
    }
  }
}
assert.equal(r.state, 'lobby');
assert.equal(r.lastGame.mode, 'battleship');
assert.equal(r.lastGame.winnerId, aid);
assert.equal(r.lastGame.players[1].remaining, 0);
assert.equal(r.lastGame.players[0].remaining, 5);
assert.equal(r.lastGame.players[0].shots.filter(s => s.hit).length, 17);
assert.equal(r.lastGame.totalShots, 19);
assert.equal(r.lastGame.lastShot.sunk, true);
assert.equal(r.lastGame.gameId, firstGame);
assert.deepEqual(r.battle.myFleet, []);
assert.ok(r.players.every(p => !p.ready));
await call('start');
assert.notEqual(r.gameId, firstGame);
assert.equal(r.battle.phase, 'placement');
assert.equal(r.battle.myFleet.length, 0);
await call('fire', a, { gameId: firstGame, index: 0, turnId: turn }, 409);
await call('place-fleet', a, { fleet });
await call('place-fleet', b, { fleet: otherFleet });
for (const index of otherFleet.flatMap(battleCells))
  await call('fire', a, { index, turnId: r.battle.turnId });
await call('change-mode', a, { mode: 'number-race', gridSize: 6 });
assert.equal(r.mode, 'number-race');
assert.equal(r.players.length, 2);
await call('change-mode', a, { mode: 'battleship' });
assert.equal(r.mode, 'battleship');
assert.equal(r.state, 'lobby');
await call('close');
await call('get', b, {}, 410);
// Client random fleets always obey the same server validator; rotation and local placement keep working across polls.
const context = vm.createContext({
  room: {
    mode: 'battleship',
    state: 'playing',
    me: 'a',
    battle: { phase: 'placement' },
    players: [{ id: 'a', ready: false }],
  },
  gameAudio: { play() {} },
  renderBattleship() {},
  document: { addEventListener() {}, activeElement: null },
});
vm.runInContext(getBattleshipClient(), context);
vm.runInContext('renderBattleship=()=>{}', context);
for (let i = 0; i < 200; i++) {
  vm.runInContext('randomBattleFleet()', context);
  assert.ok(validateBattleFleet(JSON.parse(vm.runInContext('JSON.stringify(bhDraft)', context))));
}
vm.runInContext('rotateBattleShip()', context);
assert.equal(vm.runInContext('bhVertical', context), true);
const html = await (await worker.fetch(new Request('https://test'), {})).text();
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert.ok(html.includes('Amiral Battı · 2 kişi'));
assert.ok(html.includes('Filom hazır'));
console.log(
  'PASS: private 17-cell fleet, placement validation, two-player readiness, hit extra turn, miss handoff, sunk ships, duplicate/concurrent/stale shots, 19-shot victory, snapshot, replay, mode changes, 200 random fleets and client syntax.'
);

context.esc = s => String(s); context.avatar = s => s;
context.room = { ...context.room, battle: { phase: 'battle' }, players: [] };
context.player = { id: 'a', name: 'Ada', avatar: 'a1', fleetStatus: battleShipTypes.map((t,i) => ({id:t.id,hits:i===0?1:i===1?t.length:0,status:i===0?'damaged':i===1?'sunk':'intact'})) };
const card = vm.runInContext('bhPlayerCard(player,true)', context);
assert.ok(card.includes('Uçak Gemisi') && card.includes('İsabet 1/5') && card.includes('BATTI') && card.includes('Sağlam'));
assert.equal((card.match(/class="bh-fleet-ship /g)||[]).length,5);
const cues=[];context.gameAudio={play:(name,options)=>cues.push([name,options])};
context.shot={id:'shot-1',playerId:'b',index:0,hit:true,sunk:false};
vm.runInContext('bhPlayShot(shot);bhPlayShot(shot)',context);
assert.deepEqual(cues.map(c=>c[0]),['cannon','hit']);
context.shot={...context.shot,id:'shot-2',sunk:true};
vm.runInContext('bhPlayShot(shot)',context);
assert.deepEqual(cues.map(c=>c[0]),['cannon','hit','cannon','sunk']);
console.log('PASS: named intact/damaged/sunk fleet indicators, private coordinates, final sinking snapshot and per-shot audio deduplication.');
context.room={...context.room,gameId:'local-game'};
context.shot={id:'shot-own',playerId:'a',index:3,hit:true,sunk:false};
vm.runInContext("bhLocalShot={gameId:'local-game',index:3,at:Date.now()}",context);
const beforeOwn=cues.length;
vm.runInContext('bhPlayShot(shot)',context);
assert.deepEqual(cues.slice(beforeOwn).map(c=>c[0]),['hit']);
context.room={...context.room,gameId:'next-game',lastGame:{gameId:'local-game',lastShot:{...context.shot,id:'final-shot',sunk:true}}};
vm.runInContext("bhLocalShot={gameId:'local-game',index:3,at:Date.now()};bhPlayShot(room.lastGame.lastShot)",context);
assert.equal(cues.at(-1)[0],'sunk');
console.log('PASS: locally fired cannon is not duplicated on acknowledgement or final sinking.');
