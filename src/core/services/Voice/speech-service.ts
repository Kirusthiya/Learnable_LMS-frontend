import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // 1. Load voices immediately
    this.loadVoices();

    // 2. Chrome/Edge loads voices asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  /**
   * Helper: Checks if the text contains Tamil characters
   */
  private isTamil(text: string): boolean {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    return tamilRegex.test(text);
  }

  /**
   * Helper: Selects the best available Female/High-Quality voice
   */
  private getBestVoice(isTamilText: boolean): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) this.loadVoices();

    const langCode = isTamilText ? 'ta' : 'en'; // Tamil or English

    // Filter voices based on the language
    const availableVoices = this.voices.filter(v => v.lang.startsWith(langCode));

    if (availableVoices.length === 0) return null;

    // --- PRIORITY LOGIC ---
    
    // 1. Look for High Quality "Google" or "Microsoft" voices (usually Natural/Female)
    let bestVoice = availableVoices.find(v => 
      (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha')) 
      && !v.name.toLowerCase().includes('male') // Avoid Male voices
    );

    // 2. If no premium voice found, specifically look for anything NOT marked "Male"
    if (!bestVoice) {
      bestVoice = availableVoices.find(v => !v.name.toLowerCase().includes('male'));
    }

    // 3. Fallback: If nothing else, take the first available voice for that language
    return bestVoice || availableVoices[0];
  }

  speak(text: string, rate: number = 1, volume: number = 1) {
    if (!text || !text.trim()) return;

    // Stop previous speech
    this.stop(); 

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // --- INTELLIGENT VOICE SELECTION ---
    const isTamilText = this.isTamil(text);
    const selectedVoice = this.getBestVoice(isTamilText);

    if (selectedVoice) {
      this.currentUtterance.voice = selectedVoice;
      this.currentUtterance.lang = selectedVoice.lang;
      this.currentUtterance.pitch = 1.0; 
    } else {
      this.currentUtterance.lang = isTamilText ? 'ta-IN' : 'en-US';
    }

    // Set Rate & Volume
    this.currentUtterance.rate = Math.max(0.5, Math.min(2.0, rate));
    this.currentUtterance.volume = Math.max(0, Math.min(1, volume));

    this.synth.speak(this.currentUtterance);
  }

  // --- FIX FOR YOUR ERROR ---
  
  // 1. Primary stop method
  stop() {
    try { this.synth.cancel(); } catch {}
  }

  // 2. Alias method: This fixes the error in keyboard-nav.ts and toast-service.ts
  stopAll() {
    this.stop();
  }
}