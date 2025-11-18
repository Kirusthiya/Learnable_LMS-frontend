import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {}

  speak(text: string) {
    if (!text || !text.trim()) return;

    this.synth.cancel();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.rate = 1;
    this.currentUtterance.pitch = 1;
    this.currentUtterance.volume = 1;
    this.currentUtterance.lang = "en-US";

    this.synth.speak(this.currentUtterance);
  }

  stop() {
    this.synth.cancel();
  }
}
