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
    // Directly read signal value → TypeScript 100% safe
    const modeValue = this.settings.mode(); // type: 'blind' | 'deaf'

    if (modeValue === 'deaf') return false;

    return true;
  }

  private extractText(): string {
    if (this.textToSpeak && this.textToSpeak.trim() !== '') {
      return this.textToSpeak;
    }
    return (this.el.nativeElement.textContent || '').trim();
  }

  @HostListener('focus')
  onFocus() {
    if (!this.canSpeak()) return;

    this.speech.speak(
      this.extractText(),
      this.settings.currentSettings.voiceSpeed,
      this.settings.currentSettings.voiceVolume
    );
  }

  @HostListener('click')
  onClick() {
    if (!this.canSpeak()) return;

    this.speech.speak(
      this.extractText(),
      this.settings.currentSettings.voiceSpeed,
      this.settings.currentSettings.voiceVolume
    );
  }
}
