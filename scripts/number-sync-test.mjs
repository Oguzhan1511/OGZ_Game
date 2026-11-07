import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { numberRaceClient } from '../worker/modes/number/number-ui.js';
const html = await (await worker.fetch(new Request('https://test'), {})).text(),
  script = html.match(/<script>([\s\S]*?)<\/script>/)[1],
  refreshSource = script.slice(
    script.indexOf('async function refresh()'),
    script.indexOf('\nfunction tickTimer()')
  );
const current = { code: 'ABC123', mode: 'number-race', gameId: 'old', raceVersion: 90 },
  next = { ...current, gameId: 'new', raceVersion: 1 };
let renders = 0;
const polling = vm.createContext({
  room: current,
  busy: false,
  refreshInFlight: false,
  document: { hidden: false },
  call: async () => next,
  renderRoom() {
    renders++;
  },
  $: () => null,
});
vm.runInContext(refreshSource, polling);
await vm.runInContext('refresh()', polling);
assert.equal(polling.room.gameId, 'new');
assert.equal(renders, 1);
polling.call = async () => ({ ...next, raceVersion: 0 });
await vm.runInContext('refresh()', polling);
assert.equal(renders, 1);
polling.room = { ...current, mode: 'battleship', battleVersion: 90 };
polling.call = async () => ({ ...next, mode: 'battleship', battleVersion: 1 });
await vm.runInContext('refresh()', polling);
assert.equal(polling.room.gameId, 'new');
assert.equal(renders, 2);
const elements = new Map([['#connection', { textContent: '' }]]),
  timers = [],
  acks = [];
let attempts = 0;
const state = {
  code: 'ABC123',
  mode: 'number-race',
  state: 'playing',
  gameId: 'game',
  gridSize: 4,
  round: 0,
  raceVersion: 1,
  me: 'a',
  players: [
    { id: 'a', marks: [] },
    { id: 'b', marks: [] },
  ],
  race: {
    phase: 'search',
    turnId: 'turn-1',
    chooserId: 'a',
    startsAt: Date.now() - 100,
    deadline: Date.now() + 20000,
    wrong: [],
  },
};
const client = vm.createContext({
  room: state,
  busy: false,
  clockOffset: 0,
  window: { addEventListener() {} },
  document: {
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  },
  $: selector => elements.get(selector) || null,
  gameAudio: { play() {}, countdown() {} },
  setTimeout(fn) {
    timers.push(fn);
    return timers.length;
  },
  clearTimeout() {},
  Date,
  console,
  toast() {},
  refresh() {},
  renderRoom() {},
  async call(action, extra) {
    assert.equal(action, 'mark-cells');
    attempts++;
    if (attempts === 1) throw Error('temporary offline');
    if (attempts === 2) {
      const e = Error('Oyun güncelleniyor. Tekrar dene.');
      e.status = 409;
      throw e;
    }
    acks.push(extra);
    return {
      ...state,
      raceVersion: 3,
      players: [
        { id: 'a', marks: extra.cells },
        { id: 'b', marks: [] },
      ],
    };
  },
});
vm.runInContext(numberRaceClient, client);
const button = () => ({ disabled: false, classList: { add() {} }, textContent: '' });
client.button = button();
vm.runInContext('markNumberCell(0,button)', client);
assert.match(elements.get('#connection').textContent, /Sen 1\/16/);
await vm.runInContext('flushNumberMarks()', client);
assert.equal(vm.runInContext('nrPending.size', client), 1);
assert.equal(vm.runInContext('nrBatches.size', client), 1);
// A settling turn retains its queued clicks until they are acknowledged.
client.room = {
  ...state,
  round: 0,
  raceVersion: 2,
  race: { ...state.race, phase: 'settling', cutoffAt:Date.now(), settleUntil:Date.now()+3000 },
};
vm.runInContext('nrSyncPending()', client);
assert.equal(vm.runInContext('nrPending.size', client), 1);
await vm.runInContext('flushNumberMarks()', client);
assert.equal(vm.runInContext('nrBatches.size', client), 1);
await vm.runInContext('flushNumberMarks()', client);
assert.equal(acks[0].turnId, 'turn-1');
assert.equal(acks[0].gameId, 'game');
assert.equal(acks[0].clicks.length, 1);
assert.equal(vm.runInContext('nrBatches.size', client), 0);
client.room = { ...state, gameId: 'new-game', raceVersion: 1 };
client.late = { ...state, raceVersion: 100 };
vm.runInContext("nrApply(late,'ABC123','game')", client);
assert.equal(client.room.gameId, 'new-game');
console.log(
  'PASS: guest snapshots across new games, stale same-game snapshots, live count updates, offline click retry, settling queue retention and late response isolation.'
);

// Clicks made while an earlier packet is in flight must remain queued for the next packet.
client.room={...state,gameId:'burst',players:state.players.map(p=>({...p,marks:[]}))};
vm.runInContext('nrSyncPending()',client);
let release;const bursts=[];
client.call=async(action,extra)=>{bursts.push(extra);if(bursts.length===1)return new Promise(resolve=>{release=resolve});return {...client.room,raceVersion:3,players:[{id:'a',marks:[0,1,2]},{id:'b',marks:[]}]}};
client.b0=button();client.b1=button();client.b2=button();
vm.runInContext('nrNextMarkAt=0;markNumberCell(0,b0)',client);const sending=vm.runInContext('flushNumberMarks()',client);
vm.runInContext('nrNextMarkAt=0;markNumberCell(1,b1);nrNextMarkAt=0;markNumberCell(2,b2)',client);
release({...client.room,raceVersion:2,players:[{id:'a',marks:[0]},{id:'b',marks:[]}]});await sending;
assert.equal(vm.runInContext('nrPending.size',client),2);
await vm.runInContext('flushNumberMarks()',client);assert.deepEqual(Array.from(bursts[1].cells),[1,2]);assert.equal(client.room.players[0].marks.length,3);assert.equal(vm.runInContext('nrPending.size',client),0);
// NTP-style clock correction excludes server processing time from the offset estimate.
vm.runInContext("nrObserveClock({gameId:'clock',serverReceivedAt:1100,serverNow:1600},1000,1700)",client);
assert.equal(client.clockOffset,0);
console.log('PASS: rapid in-flight mark bursts are retained, subsequent packets drain immediately, clock sampling excludes server work.');

// Turn settlement advances only after the chooser's queue is empty and server-confirmed.
let finalized=0;client.room={...state,gameId:'settle',raceVersion:5,race:{...state.race,phase:'settling',cutoffAt:Date.now(),settleUntil:Date.now()+3000},players:[{id:'a',marks:[0,1,2]},{id:'b',marks:[]}]};
vm.runInContext('nrSyncPending()',client);client.call=async(action,extra)=>{assert.equal(action,'finish-marks');finalized++;return {...client.room,raceVersion:6,round:1,race:{...client.room.race,turnId:'settled',phase:'choose',chooserId:'b'}}};
vm.runInContext('nrMaybeFinish();nrMaybeFinish()',client);await new Promise(resolve=>setImmediate(resolve));
assert.equal(finalized,1);assert.equal(client.room.race.phase,'choose');assert.equal(client.room.players[0].marks.length,3);
console.log('PASS: settling turns emit one acknowledgement after all mark packets drain.');

// Finding clicks are serialized independently of the generic UI busy flag.
client.room={...state,gameId:'finder',me:'b',raceVersion:1,race:{...state.race,board:[9,8,7,6],target:6}};
client.busy=true;
vm.runInContext('nrSyncPending()',client);
const finds=[];let releaseFind;
client.call=async(action,extra)=>{
  assert.equal(action,'find-number');finds.push(extra.index);
  if(finds.length===1)return new Promise(resolve=>{releaseFind=resolve});
  return {...client.room,raceVersion:finds.length+1,race:{...client.room.race,wrong:[0,1]}};
};
vm.runInContext("numberAction('find-number',{index:0});numberAction('find-number',{index:1});numberAction('find-number',{index:1})",client);
assert.deepEqual(finds,[0]);
assert.equal(vm.runInContext('nrFindQueue.size',client),2);
releaseFind({...client.room,raceVersion:2,race:{...client.room.race,wrong:[0]}});
await new Promise(resolve=>setImmediate(resolve));
await vm.runInContext('nrFlushFinds()',client);
assert.deepEqual(finds,[0,1]);assert.equal(vm.runInContext('nrFindQueue.size',client),0);
console.log('PASS: finder clicks survive busy/in-flight requests and duplicate clicks are ignored.');

// The deliberate click cooldown applies to marking, independently of network batching.
client.room={...state,gameId:'cooldown',players:state.players.map(p=>({...p,marks:[]}))};
vm.runInContext('nrSyncPending();nrNextMarkAt=0',client);
client.c0=button();client.c1=button();
vm.runInContext('markNumberCell(0,c0);markNumberCell(1,c1)',client);
assert.equal(vm.runInContext('nrPending.size',client),1);
assert.equal(vm.runInContext('NR_MARK_INTERVAL',client),250);
vm.runInContext('nrNextMarkAt=Date.now()-1;markNumberCell(1,c1)',client);
assert.equal(vm.runInContext('nrPending.size',client),2);
console.log('PASS: marking is capped at one click per 250ms while queued accepted clicks remain intact.');
