import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/accountservices';
import { UserService } from '../../core/services/user-service';
import { ToastService } from '../../core/services/toast-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SpeechService } from '../../core/services/Voice/speech-service';
import { VoiceInputDirective } from "../../core/directives/voice-input";
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [ CommonModule, ReactiveFormsModule,KeyboardNav, Speak, VoiceInputDirective],
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private speech = inject(SpeechService);

  @Output() cancelRegister = new EventEmitter<boolean>();

  profileForm: FormGroup;
  private currentUsername = '';

  constructor() {
    this.profileForm = this.fb.group({
      fullName: [''],
      displayName: [''],
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userResponse = this.accountService.currentUser();
    if (userResponse) {
      const user = userResponse.user;
      this.profileForm.patchValue({
        fullName: user.fullName,
        displayName: user.displayName,
        username: user.username
      });
      this.currentUsername = user.username;
    } else {
      this.toast.error("No user data found.");
      this.speech.speak("No user data found.");
    }
  }

  async updateProfile() {
    if (this.profileForm.invalid) {
      this.toast.error("Username is required.");
      this.speech.speak("Username is required.");
      return;
    }

    const formValue = this.profileForm.value;
    const payload = {
      fullName: formValue.fullName,
      displayName: formValue.displayName,
      newUsername: formValue.username
    };

    try {
      await firstValueFrom(this.userService.updateUser(payload));

      const updatedUserResponse = this.accountService.currentUser()!;
      updatedUserResponse.user.fullName = payload.fullName;
      updatedUserResponse.user.displayName = payload.displayName;
      updatedUserResponse.user.username = payload.newUsername;
      this.accountService.setCurrentUser(updatedUserResponse);

      this.toast.success("Profile updated successfully!");
      this.speech.speak("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      let message = 'An unexpected error occurred.';
      if (error instanceof HttpErrorResponse && error.status === 400 && error.error?.message) {
        message = error.error.message;
      }
      this.toast.error(message);
      this.speech.speak("Profile update failed. " + message);
    }
  }

  cancel() {
     const ok = confirm('Are you sure you want to discard changes?');
    if (!ok) return;
    this.router.navigate(['/dashboad']);
    this.speech.speak("Profile update cancelled. Returning to dashboard.");
  }
 
}
