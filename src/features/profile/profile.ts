import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/accountservices';
import { UserService } from '../../core/services/user-service';
import { ToastService } from '../../core/services/toast-service';
import { User } from '../../types/user';
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../core/directives/accessibility/speak";
import { SpeechService } from '../../core/services/Voice/speech-service';
import { VoiceInputDirective } from '../../core/directives/voice-input';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,KeyboardNav,Speak,VoiceInputDirective
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private speech = inject(SpeechService);

  editForm!: FormGroup;
  currentUser!: User;
  allUsers: User[] = [];

  displayNameError = '';
  usernameError = '';
  fullNameError = '';
  submitting = false;

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (!user) {
      this.toast.error('Unauthorized! Please login first.');
      this.speech.speak("Unauthorized! Please login first.");
      return;
    }

    this.currentUser = user;

    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users.filter(x => x.id !== this.currentUser.id);
    });

    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      fullName: [
        this.currentUser.fullName || '',
        [Validators.minLength(6), Validators.maxLength(16)]
      ],
      displayName: [
        this.currentUser.displayName || '',
        [Validators.minLength(6), Validators.maxLength(16)]
      ],
      username: [
        this.currentUser.username || '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(16)]
      ],
    });
  }

  submit() {
    if (!this.currentUser) return;

    this.displayNameError = '';
    this.usernameError = '';
    this.fullNameError = '';

    const { fullName, displayName, username } = this.editForm.value;

    // VALIDATION
    if (!username) {
      this.usernameError = 'Username is required';
      this.speech.speak(this.usernameError);
      return;
    }

    if (username.length < 6 || username.length > 16) {
      this.usernameError = 'Username must be 6-16 characters';
      this.speech.speak(this.usernameError);
      return;
    }

    if (displayName.length < 6 || displayName.length > 16) {
      this.displayNameError = 'Display Name must be 6-16 characters';
      this.speech.speak(this.displayNameError);
      return;
    }

    if (fullName && (fullName.length < 6 || fullName.length > 16)) {
      this.fullNameError = 'Full Name must be 6-16 characters';
      this.speech.speak(this.fullNameError);
      return;
    }

    const updatedUser: User = {
      ...this.currentUser,
      fullName,
      displayName,
      username
    };

    this.submitting = true;

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.accountService.setCurrentUser(updatedUser);
        this.submitting = false;

        this.toast.success("Profile updated successfully!");
        this.speech.speak("Profile updated successfully!");
      },
      error: err => {
        this.submitting = false;

        const msg = err?.error?.message || 'Failed to update profile';
        this.toast.error(msg);
        this.speech.speak(msg);
      }
    });
  }
}
