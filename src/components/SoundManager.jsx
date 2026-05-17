import { useCallback, useRef } from 'react';

// Web Audio API Sound Generator - No actual sound files needed
class SoundEngine {
  constructor() {
    this.ctx = null;
    // Read saved preference immediately so enabled state is correct before any React effect runs
    try {
      const saved = localStorage.getItem('applykaro_sound_enabled');
      this.enabled = saved === null ? true : saved === 'true';
    } catch {
      this.enabled = true;
    }
  }

  getCtx() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    return this.ctx;
  }

  resume() {
    const ctx = this.getCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  playTone(freq, duration, type = 'square', volume = 0.15, delay = 0) {
    const ctx = this.getCtx();
    if (!ctx || !this.enabled) return;
    this.resume();

    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = type;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    }, delay);
  }

  // Windows XP Error sound
  xpError() {
    this.playTone(440, 0.1, 'square', 0.15);
    this.playTone(330, 0.1, 'square', 0.15, 150);
    this.playTone(220, 0.3, 'square', 0.15, 300);
  }

  // Vine boom
  vineBoom() {
    const ctx = this.getCtx();
    if (!ctx || !this.enabled) return;
    this.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  // Dinosaur roar (multi-tone)
  dinosaurRoar() {
    [80, 100, 60, 120, 70].forEach((freq, i) => {
      this.playTone(freq, 0.3, 'sawtooth', 0.15, i * 100);
    });
  }

  // Evil laugh
  evilLaugh() {
    const laughFreqs = [300, 350, 280, 400, 250, 450, 220];
    laughFreqs.forEach((f, i) => {
      this.playTone(f, 0.15, 'sine', 0.1, i * 200);
    });
  }

  // Keyboard typing
  keyPress() {
    const freq = 800 + Math.random() * 400;
    this.playTone(freq, 0.05, 'square', 0.08);
  }

  // Fake siren
  siren() {
    const ctx = this.getCtx();
    if (!ctx || !this.enabled) return;
    this.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.0);
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.1);
  }

  // Modem connection noise
  modemConnect() {
    const freqs = [1200, 2400, 1800, 3000, 1200, 2100];
    freqs.forEach((f, i) => {
      this.playTone(f, 0.2, 'sawtooth', 0.08, i * 250);
    });
  }

  // Notification ding
  notification() {
    this.playTone(880, 0.1, 'sine', 0.1);
    this.playTone(1100, 0.1, 'sine', 0.1, 150);
  }

  // Reboot sound
  reboot() {
    const ctx = this.getCtx();
    if (!ctx || !this.enabled) return;
    this.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 1.5);
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  }

  // Printer sound
  printer() {
    for (let i = 0; i < 8; i++) {
      this.playTone(600 + Math.random() * 200, 0.05, 'square', 0.06, i * 100);
    }
  }

  // Glitch static
  glitchStatic() {
    const freqs = [100, 200, 300, 150, 250, 180];
    freqs.forEach((f, i) => {
      this.playTone(f * Math.random() * 3, 0.08, 'sawtooth', 0.05, i * 50);
    });
  }

  // Success fanfare
  successFanfare() {
    [523, 659, 784, 1047].forEach((f, i) => {
      this.playTone(f, 0.2, 'sine', 0.1, i * 150);
    });
  }

  // Cartoon scream
  cartoonScream() {
    const ctx = this.getCtx();
    if (!ctx || !this.enabled) return;
    this.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  }
}

export const soundEngine = new SoundEngine();

export const useSoundManager = () => {
  const engineRef = useRef(soundEngine);

  const play = useCallback((soundName) => {
    const engine = engineRef.current;
    switch (soundName) {
      case 'error': engine.xpError(); break;
      case 'boom': engine.vineBoom(); break;
      case 'roar': engine.dinosaurRoar(); break;
      case 'laugh': engine.evilLaugh(); break;
      case 'type': engine.keyPress(); break;
      case 'siren': engine.siren(); break;
      case 'modem': engine.modemConnect(); break;
      case 'notify': engine.notification(); break;
      case 'reboot': engine.reboot(); break;
      case 'printer': engine.printer(); break;
      case 'glitch': engine.glitchStatic(); break;
      case 'success': engine.successFanfare(); break;
      case 'scream': engine.cartoonScream(); break;
      default: break;
    }
  }, []);

  return { play };
};
