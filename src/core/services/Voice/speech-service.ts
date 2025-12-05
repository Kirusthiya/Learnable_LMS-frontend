import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {}

  speak(text: string, rate: number = 1, volume: number = 1) {
    if (!text || !text.trim()) return;

    try { this.synth.cancel(); } catch {}

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.rate = Math.max(0.5, Math.min(2.0, rate));
    this.currentUtterance.volume = Math.max(0, Math.min(1, volume));
    this.currentUtterance.pitch = 1;
    this.currentUtterance.lang = navigator.language || 'en-US';

    this.synth.speak(this.currentUtterance);
  }

  stopAll() {
    try { this.synth.cancel(); } catch {}
  }
}
