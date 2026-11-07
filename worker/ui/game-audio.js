// Cached PCM effects: pressure blast, metal impact, water and hull breakup.
export function synthesizeNavalSound(name, sampleRate = 44100) {
  const durations = { cannon: 1.45, hit: 1.15, splash: 1.25, sunk: 3.2 };
  if (!durations[name]) return null;
  const samples = new Float32Array(Math.ceil(sampleRate * durations[name]));
  let seed = 719 + name.length * 137, low = 0, mid = 0, peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate;
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    const noise = (seed >>> 0) / 2147483648 - 1;
    low += (noise - low) * (1 - Math.exp(-2 * Math.PI * 190 / sampleRate));
    mid += (noise - mid) * (1 - Math.exp(-2 * Math.PI * 2200 / sampleRate));
    const attack = Math.min(1, t / .002);
    let value = 0;
    if (name === 'cannon') {
      // Sharp ignition, deep falling pressure wave, then a distant echo.
      value = .8 * (noise - mid) * Math.exp(-t * 95)
        + 3.4 * low * Math.exp(-t * 5.3)
        + .55 * Math.sin(2 * Math.PI * (42 * t + 6 * (1 - Math.exp(-t * 22)))) * Math.exp(-t * 7);
      if (t > .18) value += .75 * low * Math.exp(-(t - .18) * 5);
    } else if (name === 'hit') {
      value = 1.3 * mid * Math.exp(-t * 24) + 2.1 * low * Math.exp(-t * 7)
        + .22 * Math.sin(2 * Math.PI * 173 * t) * Math.exp(-t * 8)
        + .13 * Math.sin(2 * Math.PI * 437 * t) * Math.exp(-t * 12)
        + .08 * Math.sin(2 * Math.PI * 793 * t) * Math.exp(-t * 15);
    } else if (name === 'splash') {
      value = 1.6 * mid * Math.min(1, t / .025) * Math.exp(-t * 7)
        + 1.8 * low * Math.exp(-t * 4)
        + .12 * Math.sin(2 * Math.PI * (120 * t + 16 * Math.sin(t * 18))) * Math.exp(-t * 6);
    } else {
      // Three secondary explosions, low hull groan, breaking metal and bubbles.
      for (const [at, strength] of [[0, 1], [.24, .65], [.58, .4]]) {
        const dt = t - at;
        if (dt >= 0) value += strength * (3 * low + .6 * mid) * Math.min(1, dt / .003) * Math.exp(-dt * 6);
      }
      value += .24 * Math.sin(2 * Math.PI * (105 * t - 11 * t * t)) * Math.exp(-t * 1.7)
        + .11 * Math.sin(2 * Math.PI * (247 * t - 18 * t * t)) * Math.exp(-t * 2.4)
        + low * .9 * Math.min(1, t / .4) * Math.exp(-t * 1.6) * (.6 + .4 * Math.sin(t * 39));
    }
    const fade = Math.min(1, (samples.length - 1 - i) / (sampleRate * .06));
    samples[i] = Math.tanh(value * attack) * fade;
    peak = Math.max(peak, Math.abs(samples[i]));
  }
  if (peak) for (let i = 0; i < samples.length; i++) samples[i] *= .88 / peak;
  return samples;
}
// Small synthesized cues: no audio downloads or network requests in the game loop.
export function createGameAudio({ createContext, isHidden = () => false } = {}) {
  const notes = {
    tap: [[1250, 0, 0.035]],
    round: [
      [523, 0, 0.09],
      [659, 0.09, 0.09],
      [784, 0.18, 0.15],
    ],
    hurry: [
      [880, 0, 0.045],
      [880, 0.09, 0.045],
    ],
    submit: [
      [659, 0, 0.06],
      [988, 0.065, 0.12],
    ],
    finish: [
      [523, 0, 0.12],
      [659, 0.12, 0.12],
      [784, 0.24, 0.12],
      [1047, 0.39, 0.32],
    ],
  };
  let context = null,
    enabled = true,
    volume = 0.35,
    lastRoom = null,
    countKey = '',
    lastSecond = null;
  const voices = new Set(), navalBuffers = new Map();
  const navalNames = new Set(['cannon', 'hit', 'splash', 'sunk']);
  function stop() {
    for (const voice of voices) {
      try {
        voice.stop();
      } catch {}
      voice.disconnect();
    }
    voices.clear();
  }
  function unlock() {
    if (!enabled) return;
    try {
      if (!context) context = createContext?.();
      if (context?.state === 'suspended') Promise.resolve(context.resume()).catch(() => {});
    } catch {
      context = null;
    }
  }
  function configure(sound, level = 0.35) {
    enabled = sound !== false;
    volume = Math.max(0, Math.min(1, Number(level) || 0));
    if (!enabled || volume === 0) stop();
  }
  function play(name, { delay = 0 } = {}) {
    if (!enabled || volume === 0 || isHidden() || context?.state !== 'running' || (!notes[name] && !navalNames.has(name)))
      return false;
    if (!navalNames.has(name) || voices.size >= 12) stop();
    try {
      const now = context.currentTime + 0.005 + Math.max(0, Math.min(1, delay));
      if (navalNames.has(name)) {
        let buffer = navalBuffers.get(name);
        if (!buffer) {
          const pcm = synthesizeNavalSound(name, context.sampleRate);
          buffer = context.createBuffer(1, pcm.length, context.sampleRate);
          buffer.getChannelData(0).set(pcm);
          navalBuffers.set(name, buffer);
        }
        const source = context.createBufferSource(), gain = context.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(volume * .7, now);
        source.connect(gain); gain.connect(context.destination);
        voices.add(source);
        source.onended = () => { voices.delete(source); source.disconnect(); gain.disconnect(); };
        source.start(now);
        return true;
      }
      for (const [frequency, offset, duration] of notes[name]) {
        const oscillator = context.createOscillator(),
          gain = context.createGain();
        oscillator.type = name === 'hurry' ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, now + offset);
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(volume * 0.14, now + offset + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        voices.add(oscillator);
        oscillator.onended = () => {
          voices.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect();
        };
        oscillator.start(now + offset);
        oscillator.stop(now + offset + duration + 0.015);
      }
      return true;
    } catch {
      stop();
      return false;
    }
  }
  function sync(room) {
    if (!room) {
      lastRoom = null;
      countKey = '';
      lastSecond = null;
      stop();
      return;
    }
    const key = room.code + '-' + room.gameId + '-' + room.mode + '-' + room.round;
    const completed =
      lastRoom?.code === room.code &&
      ['playing', 'reveal'].includes(lastRoom.state) &&
      room.state === 'lobby' &&
      room.lastGame?.finishedAt;
    if (completed || (room.state === 'finished' && lastRoom?.state !== 'finished')) play('finish');
    else if (
      room.state === 'playing' &&
      (room.mode !== 'battleship' || lastRoom?.state === 'lobby') &&
      (key !== countKey || !lastRoom || lastRoom.state === 'lobby')
    )
      play('round');
    if (key !== countKey) {
      countKey = key;
      lastSecond = null;
    }
    lastRoom = { code: room.code, state: room.state };
  }
  function countdown(room, seconds) {
    if (
      room?.mode === 'auction' ||
      room?.state !== 'playing' ||
      room.hasGuessed ||
      !Number.isInteger(seconds) ||
      seconds < 1 ||
      seconds > 5 ||
      isHidden()
    )
      return;
    const key = room.code + '-' + room.gameId + '-' + room.mode + '-' + room.round;
    if (key !== countKey) {
      countKey = key;
      lastSecond = null;
    }
    if (lastSecond === seconds) return;
    lastSecond = seconds;
    play('hurry');
  }
  return { unlock, configure, play, sync, countdown, stop };
}
export const gameAudioClient =
  synthesizeNavalSound.toString() + '\n' + createGameAudio.toString() +
  String.raw`
const gameAudio=createGameAudio({createContext:()=>{const Context=window.AudioContext||window.webkitAudioContext;return Context?new Context():null},isHidden:()=>document.hidden});
document.addEventListener('pointerdown',()=>gameAudio.unlock(),{passive:true});
document.addEventListener('keydown',()=>gameAudio.unlock());
document.addEventListener('visibilitychange',()=>{if(document.hidden)gameAudio.stop()});
`;
