import { Directive, HostListener, Input } from '@angular/core';
import { SpeechService } from '../services/speech-service';

@Directive({
  selector: '[appVoiceInput]'
})
export class VoiceInputDirective {
  @Input('appVoiceInput') target!: HTMLInputElement;
  recognition: any;
  listening = false;

  constructor(private speech: SpeechService) {}

     private canSpeak(): boolean {
    return document.body.getAttribute('speech-enabled') !== 'false';
  }


  @HostListener('click')
  startMic() {
     if (!this.canSpeak()) return;
    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) {
      this.speech.speak("Voice input not supported");
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;

    this.recognition.onresult = (e: any) => {
      let text = e.results[0][0].transcript;

      // ------------------------------
      // Special handling for email, username, password
      // ------------------------------
      if (
        this.target.type === 'email' ||
        this.target.name === 'username' ||
        this.target.name === 'password'
      ) {
        text = text.replace(/\s/g, ''); // remove all spaces
      }

      if (this.target.type === 'email') {
        text = text.toLowerCase(); // lowercase for email
      }

      this.target.value = text;
      this.speech.speak(text);

      // trigger input event for ngModel
      const event = new Event('input', { bubbles: true });
      this.target.dispatchEvent(event);
    };

    this.recognition.start();
    this.listening = true;
    this.speech.speak("Mic started. Speak now");
  }
}
