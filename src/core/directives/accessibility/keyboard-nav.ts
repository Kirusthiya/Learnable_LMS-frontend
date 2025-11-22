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
        this.currentIndex = 0;
        this.focusable[0].focus();
      }
    }, 500);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {

    if (!this.focusable || this.focusable.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();

      this.currentIndex = (this.currentIndex + 1) % this.focusable.length;

      const el = this.focusable[this.currentIndex];
      if (el) el.focus();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();

      this.currentIndex =
        (this.currentIndex - 1 + this.focusable.length) % this.focusable.length;

      const el = this.focusable[this.currentIndex];
      if (el) el.focus();
    }

    if (event.key === 'Escape') {
      this.speech.stop();
    }
  }
}
