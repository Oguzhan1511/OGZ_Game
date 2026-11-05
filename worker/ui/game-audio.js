// Small synthesized cues: no audio downloads or network requests in the game loop.
export function createGameAudio({ createContext, isHidden = () => false } = {}) {
  const notes = {
    cannon: [
      [130, 0, 0.08],
      [80, 0.05, 0.1],
    ],
    hit: [
      [196, 0, 0.08],
      [330, 0.07, 0.12],
    ],
    splash: [
      [420, 0, 0.04],
      [220, 0.05, 0.08],
    ],
    sunk: [
      [330, 0, 0.1],
      [247, 0.1, 0.1],
      [165, 0.2, 0.22],
    ],
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
  const voices = new Set();
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
  function play(name) {
    if (!enabled || volume === 0 || isHidden() || context?.state !== 'running' || !notes[name])
      return false;
    stop();
    try {
      const now = context.currentTime + 0.005;
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
  createGameAudio.toString() +
  String.raw`
const gameAudio=createGameAudio({createContext:()=>{const Context=window.AudioContext||window.webkitAudioContext;return Context?new Context():null},isHidden:()=>document.hidden});
document.addEventListener('pointerdown',()=>gameAudio.unlock(),{passive:true});
document.addEventListener('keydown',()=>gameAudio.unlock());
document.addEventListener('visibilitychange',()=>{if(document.hidden)gameAudio.stop()});
`;
