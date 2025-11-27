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
    private speechService: SpeechService,
    private settingsService: SettingsService
  ) {}

  private canSpeak(): boolean {
    // allow disabling speech by attribute on body (false) or settings
    const bodyAttr = document.body.getAttribute('speech-enabled');
    if (bodyAttr === 'false') return false;
    // check global settings speechToText flag: if user disabled speechToText we might still want to allow TTS,
    // but follow your app behavior — here we allow speech if speechToText is true OR we simply ignore it.
    return true;
  }

  private getVoiceSpeed(): number {
    return this.settingsService.currentSettings?.voiceSpeed ?? 1;
  }

  private getVoiceVolume(): number {
    return this.settingsService.currentSettings?.voiceVolume ?? 1;
  }

  @HostListener('focus')
  onFocus() {
    if (!this.canSpeak()) return;
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text, this.getVoiceSpeed(), this.getVoiceVolume());
  }

  @HostListener('click')
  onClick() {
    if (!this.canSpeak()) return;
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text, this.getVoiceSpeed(), this.getVoiceVolume());
  }
}
