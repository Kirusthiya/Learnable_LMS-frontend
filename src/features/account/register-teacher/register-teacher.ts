import { Component, effect, signal } from '@angular/core';
import { RegisterTeacherCreds, TeacherUserDto } from '../../../types/teacher';
import { AccountService } from '../../../core/services/accountservices';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-teacher',
  imports: [FormsModule],
  templateUrl: './register-teacher.html',
  styleUrl: './register-teacher.css',
})
export class RegisterTeacher {

  model = signal<RegisterTeacherCreds>({
    displayName: '',
    fullName: '',
    dateOfBirth: '',
    contactPhone: '',
    bio: '',
    avatarUrl: ''
  });

  registeredTeacher = signal<TeacherUserDto | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // This will store the readonly HTTP signal from service
  httpResultSignal = signal<(() => TeacherUserDto | null) | null>(null);

  constructor(private accountService: AccountService, 
     private router: Router) {

    // ✔ SINGLE EFFECT ALLOWED
    effect(() => {
      const httpSig = this.httpResultSignal();
      if (!httpSig) return; // not submitted yet

      const result = httpSig(); // read HTTP signal

      if (result) {
        this.registeredTeacher.set(result);
        this.isLoading.set(false);
        alert('Teacher profile created successfully!');
        this.router.navigate(['/dashboad']);
      }
    });
  }

  submit() {
    this.isLoading.set(true);
    this.error.set(null);

    // ✔ store readonly signal (not call effect here)
    const readonlySig = this.accountService.registerTeacherSignal({
      dto: this.model(),
    });

    this.httpResultSignal.set(readonlySig);
  }
}
