/**
 * Synthesizes subtle alerts via Web Audio API
 */
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playBeep(frequency = 520, duration = 0.15, type: OscillatorType = 'sine') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fail-safe
    }
  }

  playCriticalAlarm() {
    this.playBeep(880, 0.12, 'square');
    setTimeout(() => this.playBeep(660, 0.18, 'square'), 140);
  }

  playSuccessChime() {
    this.playBeep(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playBeep(659.25, 0.12, 'sine'), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.2, 'sine'), 220); // G5
  }

  playActionClick() {
    this.playBeep(440, 0.05, 'sine');
  }
}

export const soundFx = new SoundEffects();
