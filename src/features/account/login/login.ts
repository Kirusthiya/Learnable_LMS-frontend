import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AccountService } from '../../../core/services/accountservices';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule } from '@angular/forms';
import { Speak } from '../../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-login',
  imports: [FormsModule,Speak,KeyboardNav],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService); // <-- Inject toast service

  @Output() closeLoginEvent = new EventEmitter<void>();
  creds = { email: '', password: '' };

  // Back button
  onBack() {
    this.closeLoginEvent.emit();
  }

  // Normal login
  onLogin() {
    this.accountService.login(this.creds).subscribe({
      next: (user) => {
        this.toast.success('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Login failed. Check credentials.');
      }
    });
  }

  // Google login
  onGoogleLogin() {
    const token = 'GOOGLE_TOKEN';
    this.accountService.loginWithGoogle(token).subscribe({
      next: (user) => {
        this.toast.success('Google login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Google login failed.');
      }
    });
  }

  // Forgot password
  onForgotPassword() {
    this.toast.info('Redirect to Forgot Password page.');
  }

}
