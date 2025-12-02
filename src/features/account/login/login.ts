import { Component, EventEmitter, inject, output, Output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";
import { InputSpeakDirective } from "../../../core/directives/app-input-speak";
import { AccountService } from "../../../core/services/accountservices";
import { Router } from "@angular/router";
import { SpeechService } from "../../../core/services/Voice/speech-service";
import { ToastService } from "../../../core/services/toast-service";
import { Register } from "../register/register";
import { LoginCreds } from "../../../types/user";
import { VoiceInputDirective } from "../../../core/directives/voice-input";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Speak, KeyboardNav, InputSpeakDirective, Register,VoiceInputDirective],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private speech = inject(SpeechService);
  protected registerMode = signal(false);
   protected creds: any = {};
  

  closeLogin = output<boolean>();


  micActive: boolean = false;  // <-- FIX

  // Back button
  onBack() {
     this.closeLogin.emit(false);
  }

 showRegister(value: boolean) {
    this.registerMode.set(value);
  }

  login(){
    // console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: result => {
        // console.log(result);
        this.router.navigateByUrl('/dashboad');
        this.toast.success("Login successfully");
        this.speech.speak('Login successfully')

        this.creds = {};
      },
      error: error => {
        this.toast.error(error.error);
        console.log(error.message);
      }
    })
  }



  // Mic toggle
  toggleMic() {
    this.micActive = !this.micActive; 
    if(this.micActive){
      this.speech.speak('Mic turned on. Press Alt+M to stop listening.');
    } else {
      this.speech.speak('Mic turned off.');
    }
  }
}
