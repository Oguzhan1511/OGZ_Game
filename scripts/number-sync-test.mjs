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
// A turn can change while the original click is waiting for its retry.
client.room = {
  ...state,
  round: 1,
  raceVersion: 2,
  race: { ...state.race, turnId: 'turn-2', phase: 'choose', chooserId: 'b' },
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
  'PASS: guest snapshots across new games, stale same-game snapshots, live count updates, offline click retry, old-turn queue retention and late response isolation.'
);
