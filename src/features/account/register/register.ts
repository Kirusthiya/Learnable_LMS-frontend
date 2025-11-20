import { Component, inject, output } from '@angular/core';
import { AccountService } from '../../../core/services/accountservices';
import { RegisterCreds } from '../../../types/user';
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Speak } from '../../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';
import { SpeechService } from '../../../core/services/speech-service';
import { VoiceInputDirective } from '../../../core/directives/voice-input';
import { InputSpeakDirective } from '../../../core/directives/app-input-speak';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, Speak, VoiceInputDirective, InputSpeakDirective,KeyboardNav],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

  private accountService = inject(AccountService);
  private toast = inject(ToastService);
  private speech = inject(SpeechService);
  private router =inject(Router)

  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  sendingOtp = false;
  otpSent = false;
  registering = false;

  removeSpaces(value: string): string {
    return value.replace(/\s/g, '').toLowerCase();
  }

  sendOtp() {
    if (!this.creds.email) {
      this.toast.error('Please enter an email.');
      this.speech.speak('Please enter an email.');
      return;
    }

    this.sendingOtp = true;
    this.creds.otp = ''; // reset OTP every time we send new one

    this.accountService.sendOtp(this.creds.email).subscribe({
      next: () => {
        this.toast.success('OTP sent to your email.');
        this.speech.speak('OTP sent to your email.');
        this.otpSent = true;
        this.sendingOtp = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Failed to send OTP.';
        this.toast.error(msg);
        this.speech.speak(msg);
        this.sendingOtp = false;
      }
    });
  }

  register() {
    if (!this.creds.username || !this.creds.email || !this.creds.password) {
      this.toast.error('Please fill username, email, and password first.');
      this.speech.speak('Please fill username, email, and password first.');
      return;
    }

    if (!this.creds.otp) {
      this.toast.info('Please enter the OTP sent to your email.');
      this.speech.speak('Please enter the OTP sent to your email.');
      return;
    }

    this.registering = true;

    this.accountService.register(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboad');
        this.toast.success('Registration successful!');
        this.speech.speak('Registration successful!');
        this.registering = false;
        this.cancelRegister.emit(false);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed.';
        this.toast.error(msg);
        this.speech.speak(msg);

     
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
