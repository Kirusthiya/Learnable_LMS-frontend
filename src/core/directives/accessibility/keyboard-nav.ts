import { Directive, HostListener, ElementRef } from "@angular/core";
import { SpeechService } from "../../services/Voice/speech-service";
import { AssetService } from "../../services/asset-service";

@Directive({
  selector: '[appKeyboardNav]'
})
export class KeyboardNav {
  focusable: HTMLElement[] = [];
  currentIndex = 0;

  constructor(
    private el: ElementRef<HTMLElement>, 
    private speech: SpeechService,
    private assetService: AssetService
  ) {}

  private loadFocusable() {
    let container: HTMLElement;

    if (this.assetService.explainPopupVisible()) {
      // Popup focus
      container = document.querySelector('.fixed.inset-0') as HTMLElement;
    } else {
      // Focus inside the current host element
      container = this.el.nativeElement;
    }

    if (!container) return;

    this.focusable = Array.from(container.querySelectorAll(`
      [tabindex="0"],
      button,
      a[href],
      input,
      select,
      textarea,
      [role="button"]
    `)) as HTMLElement[];

    if (this.currentIndex >= this.focusable.length) this.currentIndex = 0;

    if (this.focusable.length) {
      this.focusable[this.currentIndex].focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    this.loadFocusable();
    if (!this.focusable.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.currentIndex = (this.currentIndex + 1) % this.focusable.length;
      this.focusable[this.currentIndex].focus();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.currentIndex = (this.currentIndex - 1 + this.focusable.length) % this.focusable.length;
      this.focusable[this.currentIndex].focus();
    }

    if (event.key === 'Escape') {
      this.speech.stop();
    }
  }
}
