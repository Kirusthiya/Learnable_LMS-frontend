import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/accountservices';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editprofile',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './editprofile.html',
  styleUrl: './editprofile.css',
})
export class Editprofile {
   profileForm!: FormGroup;
  loading = false;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (user) {
      this.userId = user.id;
      this.loadProfile();
    }
  }

  loadProfile() {
    this.userService.getUserById(this.userId).subscribe((user: User) => {
      this.profileForm = this.fb.group({
        fullName: [user.fullName, Validators.required],
        displayName: [user.displayName, Validators.required],
        username: [user.username, [Validators.required, Validators.email]],
    
      });
    });
  }

  hasError(field: string) {
    const control = this.profileForm.get(field);
    return control?.touched && control.invalid;
  }

  success(field: string) {
    const control = this.profileForm.get(field);
    return control?.touched && control.valid;
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.userService.updateUser(this.profileForm.value).subscribe({
      next: () => {
        // Backend return panna maataanga → GET latest
        this.userService.getUserById(this.userId).subscribe((latest: User) => {
          this.profileForm.patchValue(latest);
          this.loading = false;
          alert('Profile updated successfully!');
        });
      },
      error: () => {
        this.loading = false;
        alert('Update failed. Try again.');
      }
    });
  }


}
