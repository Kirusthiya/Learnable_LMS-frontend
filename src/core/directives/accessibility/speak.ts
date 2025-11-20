

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { SpeechService } from '../../services/speech-service';

@Directive({
  selector: '[appSpeak]'
})
export class Speak {

  @Input('appSpeak') textToSpeak: string = '';

  constructor(
    private el: ElementRef,
    private speechService: SpeechService
  ) {}

  private canSpeak(): boolean {
    return document.body.getAttribute('speech-enabled') !== 'false';
  }

  @HostListener('focus')
  onFocus() {
    if (!this.canSpeak()) return;
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text);
  }

  @HostListener('click')
  onClick() {
    if (!this.canSpeak()) return;
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text);
  }
}
