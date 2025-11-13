import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { SpeechService } from '../../services/speech-service';

@Directive({
  selector: '[appSpeak]'
})
export class Speak {

  @Input('appSpeak') textToSpeak: string = '';

  constructor(
    private el: ElementRef,
    private speechService: SpeechService  // <-- Renamed
  ) {}

  @HostListener('focus')
  onFocus() {
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text);  // <-- Fixed
  }

  @HostListener('click')
  onClick() {
    const text = this.textToSpeak || this.el.nativeElement.innerText;
    this.speechService.speak(text);  // <-- Fixed
  }
}
