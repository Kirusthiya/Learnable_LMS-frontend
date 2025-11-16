import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";
import { InputSpeakDirective } from "../../../core/directives/app-input-speak";
import { AccountService } from "../../../core/services/accountservices";
import { Router } from "@angular/router";
import { SpeechService } from "../../../core/services/speech-service";
import { ToastService } from "../../../core/services/toast-service";
import { Register } from "../register/register";
import { LoginCreds } from "../../../types/user";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Speak, KeyboardNav, InputSpeakDirective, Register],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private speech = inject(SpeechService);
  protected registerMode = signal(false);

  showRegister(value: boolean) {
    this.registerMode.set(value);
  }


  @Output() closeLoginEvent = new EventEmitter<void>();
  protected creds = {} as LoginCreds;

  // 🔹 Add this property
  micActive: boolean = false;  // <-- FIX

  // Back button
  onBack() {
    this.closeLoginEvent.emit();
  }

  // Normal login
  onLogin() {
    this.accountService.login(this.creds).subscribe({
      next: (user) => {
        this.toast.success('Login successful!');
        this.speech.speak('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Login failed. Check credentials.');
        this.speech.speak('Login failed. Check credentials.');
      }
    });
  }

  // Google login
  onGoogleLogin() {
    const token = 'GOOGLE_TOKEN';
    this.accountService.loginWithGoogle(token).subscribe({
      next: (user) => {
        this.toast.success('Google login successful!');
        this.speech.speak('Google login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Google login failed.');
        this.speech.speak('Google login failed.');
      }
    });
  }

  // Forgot password
  onForgotPassword() {
    this.toast.info('Redirect to Forgot Password page.');
    this.speech.speak('Redirect to Forgot Password page.');
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
