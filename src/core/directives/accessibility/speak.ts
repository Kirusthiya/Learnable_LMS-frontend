

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { SpeechService } from '../../services/Voice/speech-service';
import { SettingsService } from '../../services/Voice/settings-service';

@Directive({
  selector: '[appSpeak]'
})
export class Speak {

  @Input('appSpeak') textToSpeak: string = '';

  constructor(
    private el: ElementRef,
    private speech: SpeechService,
    private settings: SettingsService
  ) {}

  private canSpeak(): boolean {
    const bodyAttr = document.body.getAttribute('speech-enabled');
    if (bodyAttr === 'false') return false;
    return true;
  }
  private getVoiceSpeed(): number {
    return this.settings.currentSettings?.voiceSpeed ?? 1;
  }

  private getVoiceVolume(): number {
    return this.settings.currentSettings?.voiceVolume ?? 1;
  }
  private extractText(): string {
    if (this.textToSpeak && this.textToSpeak.trim() !== '') {
      return this.textToSpeak;
    }

    // Dynamic content safe reading
    return (this.el.nativeElement.textContent || '').trim();
  }

  @HostListener('focus')
  onFocus() {
    if (!this.canSpeak()) return;
    this.speech.speak(this.extractText(), this.settings.currentSettings?.voiceSpeed ?? 1, this.settings.currentSettings?.voiceVolume ?? 1);
  }

  @HostListener('click')
  onClick() {
    if (!this.canSpeak()) return;
    this.speech.speak(this.extractText(), this.settings.currentSettings?.voiceSpeed ?? 1, this.settings.currentSettings?.voiceVolume ?? 1);
  }
}
