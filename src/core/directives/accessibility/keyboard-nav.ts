import { Directive, HostListener, AfterViewInit } from "@angular/core";
import { SpeechService } from "../../services/Voice/speech-service";

@Directive({
  selector: '[appKeyboardNav]'
})
export class KeyboardNav implements AfterViewInit {

  focusable: HTMLElement[] = [];
  currentIndex = 0;

  constructor(private speech: SpeechService) {}

  ngAfterViewInit(): void {
    this.loadFocusable();

    // re-check after small delay for dynamic DOM
    setTimeout(() => this.loadFocusable(), 300);
    setTimeout(() => this.loadFocusable(), 1000);
  }

  // load all elements that can be focused
  private loadFocusable() {
    this.focusable = Array.from(document.querySelectorAll(`
      [tabindex="0"],
      button,
      a[href],
      input,
      select,
      textarea,
      [role="button"]
    `)) as HTMLElement[];

    if (this.focusable.length > 0) {
      this.currentIndex = 0;
      this.focusable[0].focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    if (!this.focusable.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.currentIndex = (this.currentIndex + 1) % this.focusable.length;
      this.focusable[this.currentIndex]?.focus();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.currentIndex = (this.currentIndex - 1 + this.focusable.length) % this.focusable.length;
      this.focusable[this.currentIndex]?.focus();
    }

    if (event.key === 'Escape') {
      this.speech.stopAll();
    }
  }
}