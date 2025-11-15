import { Directive, ElementRef, HostListener } from '@angular/core';
import { SpeechService } from '../services/speech-service';

@Directive({
  selector: '[appInputSpeak]'
})
export class InputSpeakDirective {

  recognition: any;
  listening: boolean = false;

  constructor(private el: ElementRef<HTMLInputElement>, private speech: SpeechService) {}

  // Typing → letter by letter read
  @HostListener('input')
  onInput() {
    const value = this.el.nativeElement.value;
    const lastChar = value[value.length - 1];
    if(lastChar){
      this.speech.speak(lastChar);
    }
  }

  // Ctrl → full input read
  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent){
    const activeEl = document.activeElement as HTMLInputElement;
    if(activeEl !== this.el.nativeElement) return;

    // Ctrl → full input read
    if(event.key === 'Control'){
      const value = this.el.nativeElement.value;
      this.speech.speak(value);
    }

    // Alt+M → toggle mic
    if(event.altKey && event.key.toLowerCase() === 'm'){
      this.toggleMic();
    }

    // Enter → start mic
    if(event.key === 'Enter'){
      this.toggleMic();
      event.preventDefault(); // avoid form submit if needed
    }
  }

  toggleMic(){
    if(this.listening){
      this.recognition.stop();
      this.listening = false;
      this.speech.speak('Mic stopped');
    } else {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if(!SpeechRecognition){
        this.speech.speak('Speech recognition not supported');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        // Update input field live
        this.el.nativeElement.value = transcript;

        // Speak back
        this.speech.speak(transcript);
      };

      this.recognition.start();
      this.listening = true;
      this.speech.speak('Mic started. Speak now.');
    }
  }
}
