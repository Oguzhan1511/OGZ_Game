import assert from 'node:assert/strict';
import { createGameAudio, synthesizeNavalSound } from '../worker/ui/game-audio.js';
const scheduled = [];
let hidden = false,
  resumes = 0;
const context = {
  state: 'suspended',
  currentTime: 10,
  sampleRate: 44100,
  createBuffer(channels, length, rate) {
    const data = new Float32Array(length);
    return { getChannelData: () => data, duration: length / rate };
  },
  createBufferSource() {
    const voice = { stopped: false };
    scheduled.push(voice);
    return {
      set buffer(value) { voice.buffer = value; },
      connect() {}, disconnect() {},
      start(at) { voice.start = at; },
      stop() { voice.stopped = true; },
    };
  },
  destination: {},
  resume() {
    resumes++;
    this.state = 'running';
    return Promise.resolve();
  },
  createOscillator() {
    const note = { stopped: false, frequency: null };
    scheduled.push(note);
    return {
      frequency: {
        setValueAtTime(v) {
          note.frequency = v;
        },
      },
      connect() {},
      disconnect() {},
      start(at) {
        note.start = at;
      },
      stop() {
        note.stopped = true;
      },
    };
  },
  createGain() {
    return {
      gain: {
        setValueAtTime() {},
        linearRampToValueAtTime(v) {
          assert.ok(v <= 0.14);
        },
        exponentialRampToValueAtTime(v) {
          assert.ok(v > 0);
        },
      },
      connect() {},
      disconnect() {},
    };
  },
};
const audio = createGameAudio({ createContext: () => context, isHidden: () => hidden });
assert.equal(audio.play('round'), false);
audio.unlock();
assert.equal(resumes, 1);
let room = { code: 'ABC123', gameId: 'game-1', mode: 'car-price', round: 0, state: 'lobby' };
audio.sync(room);
assert.equal(scheduled.length, 0);
room = { ...room, state: 'playing' };
audio.sync(room);
assert.equal(scheduled.length, 3);
for (let n = 0; n < 20; n++) audio.sync({ ...room, submitted: n % 2 });
assert.equal(scheduled.length, 3);
audio.countdown(room, 6);
assert.equal(scheduled.length, 3);
audio.countdown(room, 5);
assert.equal(scheduled.length, 5);
for (let n = 0; n < 4; n++) audio.countdown(room, 5);
assert.equal(scheduled.length, 5);
audio.countdown(room, 4);
assert.equal(scheduled.length, 7);
audio.countdown({ ...room, hasGuessed: true }, 3);
assert.equal(scheduled.length, 7);
audio.play('submit');
assert.equal(scheduled.length, 9);
audio.sync({ ...room, state: 'reveal' });
assert.equal(scheduled.length, 9);
room = { ...room, round: 1 };
audio.sync(room);
assert.equal(scheduled.length, 12);
audio.sync({ ...room, state: 'reveal' });
audio.sync({ ...room, state: 'lobby', gameId: 'game-2', lastGame: { finishedAt: 100 } });
assert.equal(scheduled.length, 16);
audio.sync({ ...room, state: 'lobby', gameId: 'game-2', lastGame: { finishedAt: 100 } });
assert.equal(scheduled.length, 16);
audio.configure(false);
assert.ok(scheduled.every(n => n.stopped));
assert.equal(audio.play('finish'), false);
audio.configure(true, 0);
assert.equal(audio.play('submit'), false);
audio.configure(true, 0.35);
hidden = true;
assert.equal(audio.play('round'), false);
audio.countdown(room, 2);
assert.equal(scheduled.length, 16);
hidden = false;
audio.sync(null);
audio.sync({ ...room, state: 'lobby', lastGame: { finishedAt: 100 } });
assert.equal(scheduled.length, 16);
room = { ...room, mode: 'auction', state: 'playing' };
audio.sync(room);
assert.equal(scheduled.length, 19);
audio.countdown(room, 3);
assert.equal(scheduled.length, 19);
audio.sync({ ...room, round: 2 });
assert.equal(scheduled.length, 22);
audio.sync({ ...room, state: 'lobby', lastGame: { finishedAt: 200 } });
assert.equal(scheduled.length, 26);
const unsupported = createGameAudio({ createContext: () => null });
unsupported.unlock();
assert.equal(unsupported.play('round'), false);
const broken = createGameAudio({
  createContext: () => {
    throw Error('Audio unavailable');
  },
});
assert.doesNotThrow(() => broken.unlock());
assert.equal(broken.play('round'), false);
console.log(
  'PASS: gesture unlock, unique round cues across polling, countdown deduplication, submitted-guess silence, completion, auction rounds, mute/volume, hidden tabs and unavailable audio.'
);

const taps = scheduled.length;
assert.equal(audio.play('tap'), true);
assert.equal(scheduled.length, taps + 1);
audio.configure(false);
assert.equal(audio.play('tap'), false);
console.log('PASS: immediate short tap cue respects mute.');

audio.configure(true, 0.35);
for (const cue of ['cannon', 'hit', 'splash', 'sunk']) {
  const before = scheduled.length;
  assert.equal(audio.play(cue), true);
  assert.ok(scheduled.length > before);
}
console.log('PASS: battleship cannon, hit, miss and sinking cues.');

const lastVoice = scheduled.at(-1);
assert.ok(lastVoice.buffer.duration > 3);
assert.equal(audio.play('hit', { delay: .22 }), true);
assert.equal(lastVoice.stopped, false, 'Impact must not cut off the cannon/sinking tail');
assert.ok(scheduled.at(-1).start >= context.currentTime + .22);
const cached = scheduled.at(-1).buffer;
audio.play('hit');
assert.equal(scheduled.at(-1).buffer, cached);
audio.configure(false);
assert.ok(scheduled.every(v => v.stopped));
for (const sampleRate of [22050, 44100, 48000]) {
  for (const cue of ['cannon', 'hit', 'splash', 'sunk']) {
    const pcm = synthesizeNavalSound(cue, sampleRate);
    assert.ok(pcm.length >= sampleRate);
    let peak = 0, energy = 0;
    for (const value of pcm) { assert.ok(Number.isFinite(value)); peak = Math.max(peak, Math.abs(value)); energy += value * value; }
    assert.ok(peak <= .881 && peak > .8);
    assert.ok(Math.sqrt(energy / pcm.length) > .01);
    assert.ok(Math.abs(pcm[0]) < .001 && Math.abs(pcm.at(-1)) < .001);
  }
}
console.log('PASS: cached naval PCM, unclipped finite waveforms at three sample rates, overlapping blast/impact tails, delayed impacts and mute cleanup.');
