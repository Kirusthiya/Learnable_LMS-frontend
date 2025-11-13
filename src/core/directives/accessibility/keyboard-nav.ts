import { Directive, HostListener } from '@angular/core';
import { SpeechService } from '../../services/speech-service';

@Directive({
  selector: '[appKeyboardNav]'
})
export class KeyboardNav {

  focusable: HTMLElement[] = [];
  currentIndex = 0;

  constructor(private speech: SpeechService) {
    setTimeout(() => {
      this.focusable = Array.from(document.querySelectorAll('[tabindex="0"]')) as HTMLElement[];
      if (this.focusable.length > 0) {
        this.focusable[0].focus();
      }
    }, 500);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.currentIndex = (this.currentIndex + 1) % this.focusable.length;
      this.focusable[this.currentIndex].focus();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.currentIndex =
        (this.currentIndex - 1 + this.focusable.length) % this.focusable.length;

      this.focusable[this.currentIndex].focus();
    }

    if (event.key === 'Escape') {
      this.speech.stop();
    }
  }
}
