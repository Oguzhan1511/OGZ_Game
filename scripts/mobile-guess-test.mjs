import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../worker/index.js';
import { cars } from '../worker/modes/car/catalog.js';
const html = await (await worker.fetch(new Request('https://game.test/'), {})).text();
const source = html.match(/function renderGame\(\)\s*\{[\s\S]*?\n\}/)[0];
assert.ok(source.includes('id="game-score-list"'));
const room = {
  code: 'ABC123',
  round: 0,
  rounds: 10,
  state: 'playing',
  hasGuessed: false,
  submitted: 0,
  players: [
    { id: 'me', name: 'Ada', avatar: 'a0', score: 0 },
    { id: 'guest', name: 'Ece', avatar: 'a1', score: 0 },
  ],
  me: 'me',
  car: cars.find(c => c[11]?.source === 'user').filter((_, i) => i !== 6),
};
const nodes = new Map();
let replacements = 0;
const document = {
  activeElement: null,
  body: { classList: { add() {}, remove() {}, toggle() {} } },
};
const content = {
  set innerHTML(value) {
    replacements++;
    this.html = value;
    nodes.set('.game-board', {
      dataset: {
        roundKey: room.code + '-' + (room.gameId || 'legacy') + '-' + room.round,
        state: room.state,
        guessed: String(room.hasGuessed),
      },
    });
    nodes.set('#game-score-list', { innerHTML: '' });
    nodes.set('.game-scores .panel-heading>span', { textContent: '' });
    nodes.set('#guess-status', { textContent: '' });
    nodes.set('#guess', {
      value: '',
      selectionStart: 0,
      focus() {
        document.activeElement = this;
      },
      setSelectionRange(start) {
        this.selectionStart = start;
      },
    });
  },
};
nodes.set('#content', content);
const context = vm.createContext({
  room,
  document,
  $: selector => nodes.get(selector),
  money: n => String(n),
  esc: s => String(s),
  avatar: () => '',
  tickTimer() {},
  setupMobileGameViewport() {},
  setupMobileRoundRanking() {},
  mobileRoundRankingMarkup() {
    return '';
  },
  guessDraftKey: '',
  guessDraftValue: '',
});
vm.runInContext(source, context);
vm.runInContext('renderGame()', context);
const input = nodes.get('#guess');
input.value = '875.000';
input.selectionStart = 3;
document.activeElement = input;
room.submitted = 1;
vm.runInContext('renderGame()', context);
assert.equal(replacements, 1);
assert.equal(nodes.get('#guess'), input);
assert.equal(document.activeElement, input);
assert.equal(input.selectionStart, 3);
assert.equal(input.value, '875.000');
assert.equal(nodes.get('#guess-status').textContent, '1 / 2 oyuncu tahminini gönderdi');
room.state = 'reveal';
room.results = [
  { id: 'me', guess: 875000, points: 50 },
  { id: 'guest', guess: 1000000, points: 100 },
];
room.price = 1000000;
vm.runInContext('renderGame()', context);
assert.equal(replacements, 2);
const refreshSource = html.match(
  /async function refresh\(\)\s*\{[\s\S]*?(?=\nfunction tickTimer)/
)[0];
let resolve,
  refreshCalls = 0;
const oldRoom = { code: 'ABC123', state: 'playing' };
const refreshContext = vm.createContext({
  room: oldRoom,
  busy: false,
  refreshInFlight: false,
  document: { hidden: false },
  call: () => {
    refreshCalls++;
    return new Promise(r => (resolve = r));
  },
  renderRoom: () => {
    throw Error('Stale response rendered');
  },
  $: () => null,
  leaveView() {},
  toast() {},
});
vm.runInContext(refreshSource, refreshContext);
const pending = vm.runInContext('refresh()', refreshContext);
await vm.runInContext('refresh()', refreshContext);
assert.equal(refreshCalls, 1);
refreshContext.room = { code: 'ABC123', state: 'reveal' };
resolve({ code: 'ABC123', state: 'playing' });
await pending;
assert.equal(refreshContext.room.state, 'reveal');
console.log(
  'PASS: same input node, focus, value and caret survive other-player updates; round reveal replaces the view; stale polling replies ignored.'
);
