import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/accountservices';
import { UserService } from '../../core/services/user-service';
import { ToastService } from '../../core/services/toast-service';
import { User } from '../../types/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private toast = inject(ToastService);

  editForm!: FormGroup;
  currentUser!: User;
  allUsers: User[] = [];
  avatarUrl: string = '';

  displayNameError: string = '';
  usernameError: string = '';
  fullNameError: string = '';
  submitting: boolean = false;

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (!user) {
      this.toast.error('Unauthorized! Please login first.');
      return;
    }

    this.currentUser = user;
    this.avatarUrl = `https://i.pravatar.cc/150?u=${this.currentUser.id}`;

    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users.filter(u => u.id !== this.currentUser.id);
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

  isDisplayNameDuplicate(name: string): boolean {
    return this.allUsers.some(u => u.displayName.toLowerCase() === name.toLowerCase());
  }

  submit() {
    if (!this.currentUser) return;

    this.displayNameError = '';
    this.usernameError = '';
    this.fullNameError = '';

    const { fullName, displayName, username } = this.editForm.value;

    // Username validation
    if (!username) {
      this.usernameError = 'Username is required';
      return;
    }
    if (username.length < 6 || username.length > 16) {
      this.usernameError = 'Username must be 6-16 characters';
      return;
    }

    // Display name validation
    if (!displayName) {
      this.displayNameError = 'Display Name is required';
      return;
    }
    if (displayName.length < 6 || displayName.length > 16) {
      this.displayNameError = 'Display Name must be 6-16 characters';
      return;
    }
    if (displayName === this.currentUser.displayName) {
      this.displayNameError = 'Display Name same as current. Cannot reuse.';
      return;
    }
    if (this.isDisplayNameDuplicate(displayName)) {
      this.displayNameError = 'Display Name already taken';
      return;
    }

    // Full name validation (optional)
    if (fullName && (fullName.length < 6 || fullName.length > 16)) {
      this.fullNameError = 'Full Name must be 6-16 characters';
      return;
    }

    const updatedUser: User = { ...this.currentUser, fullName, displayName, username };

    this.submitting = true;

    this.userService.updateUser(updatedUser).subscribe({
      next: (res) => {
        this.accountService.setCurrentUser(updatedUser);
        this.submitting = false;
        this.toast.success('Profile updated successfully!');
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error(err?.error?.message || 'Failed to update profile');
      }
    });
  }
}
