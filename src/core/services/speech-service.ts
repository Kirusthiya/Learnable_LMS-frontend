import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private speech = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {}

  speak(text: string) {
    if (!text) return;

    this.speech.cancel();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.rate = 1;
    this.currentUtterance.pitch = 1;
    this.currentUtterance.volume = 1;

    this.speech.speak(this.currentUtterance);
  }

  stop() {
    this.speech.cancel();
  }
  
}
