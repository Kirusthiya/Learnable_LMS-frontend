import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { SpeechService } from '../../services/Voice/speech-service';
import { SettingsService } from '../../services/Voice/settings-service';

@Directive({
  selector: '[appSpeak]',
  standalone: true // If using Angular 14+ standalone components
})
export class Speak {

  @Input('appSpeak') textToSpeak: string = '';

  constructor(
    private el: ElementRef,
    private speech: SpeechService,
    private settings: SettingsService
  ) {}

  private canSpeak(): boolean {
    const modeValue = this.settings.mode(); // type: 'blind' | 'deaf'
    if (modeValue === 'deaf') return false;
    return true;
  }

  private extractText(): string {
    if (this.textToSpeak && this.textToSpeak.trim() !== '') {
      return this.textToSpeak;
    }
    // Fallback to text content if input is empty
    return (this.el.nativeElement.textContent || '').trim();
  }

  @HostListener('focus')
  onFocus() {
    if (!this.canSpeak()) return;
    this.triggerSpeech();
  }

  @HostListener('click')
  onClick() {
    if (!this.canSpeak()) return;
    this.triggerSpeech();
  }
  
  // Optional: Mouse enter (Desktop users might like this)
  @HostListener('mouseenter')
  onHover() {
     // Uncomment if you want hover-to-speak functionality
     // if (!this.canSpeak()) return;
     // this.triggerSpeech();
  }

  // Optional: Stop speaking when user leaves the element (Better Control)
  @HostListener('mouseleave')
  onLeave() {
     this.speech.stop();
  }

  @HostListener('blur')
  onBlur() {
     this.speech.stop();
  }

  private triggerSpeech() {
    const text = this.extractText();
    // Default values if settings are missing
    const speed = this.settings.currentSettings?.voiceSpeed || 1;
    const volume = this.settings.currentSettings?.voiceVolume || 1;

    this.speech.speak(text, speed, volume);
  }
}