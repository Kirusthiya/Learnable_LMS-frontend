import { Directive, ElementRef, HostListener } from '@angular/core';
import { SpeechService } from '../services/Voice/speech-service';

@Directive({
  selector: '[appInputSpeak]'
})
export class InputSpeakDirective {

  recognition: any;
  listening = false;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private speech: SpeechService
  ) {}


    private canSpeak(): boolean {
    return document.body.getAttribute('speech-enabled') !== 'false';
  }

  // LETTER BY LETTER
  @HostListener('input')
  onInput() {
     if (!this.canSpeak()) return;
    const val = this.el.nativeElement.value;
    const last = val[val.length - 1];
    if (last) this.speech.speak(last);
  }

  // KEYBOARD SHORTCUTS
  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    if (!this.canSpeak()) return;
    const active = document.activeElement as HTMLInputElement;
    if (active !== this.el.nativeElement) return;

    // Ctrl → full read
    if (event.key === 'Control') {
      this.speech.speak(this.el.nativeElement.value);
    }

    // Alt+M → Mic toggle
    if (event.altKey && event.key.toLowerCase() === 'm') {
      this.toggleMic();
    }

    // Enter → Mic toggle
    if (event.key === 'Enter') {
      this.toggleMic();
      event.preventDefault();
    }
  }

  // MIC CONTROL
  toggleMic() {
     if (!this.canSpeak()) return;
    if (this.listening) {
      this.recognition.stop();
      this.listening = false;
      this.speech.speak("Mic stopped");
      return;
    }

    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) {
      this.speech.speak("Speech recognition not supported");
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      this.el.nativeElement.value = text;
      this.speech.speak(text);
    };

    this.recognition.onend = () => {
      this.listening = false;
    };

    this.recognition.start();
    this.listening = true;
    this.speech.speak("Mic started. Speak now");
  }
}
