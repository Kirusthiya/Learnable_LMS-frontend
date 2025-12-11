import { Component, effect, signal } from '@angular/core';
import { RegisterTeacherCreds, TeacherUserDto } from '../../../types/teacher';
import { AccountService } from '../../../core/services/accountservices';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";

@Component({
  selector: 'app-register-teacher',
  imports: [FormsModule, KeyboardNav, Speak],
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

  httpResultSignal = signal<(() => TeacherUserDto | null) | null>(null);

  constructor(private accountService: AccountService, 
  private router: Router) {

effect(() => {
      const user = this.accountService.currentUser();
      if (user) {
        setTimeout(() => {
    this.model.update(currentModel => ({
            ...currentModel,
            fullName: user.user.fullName || currentModel.fullName,
            displayName: user.user.displayName || currentModel.displayName,
          }));
        }, 0);
      }
    }, { allowSignalWrites: true }); 

    // FIX 2: Update current user, redirect to /dashboard, and force reload.
    effect(() => {
      const httpSig = this.httpResultSignal();
      if (!httpSig) return; 

      const result = httpSig(); 

    if (result) {
       this.registeredTeacher.set(result);
       this.isLoading.set(false);

       this.accountService.refreshCurrentUser(result.userResponse as any); 

     alert('Teacher profile created successfully!');
    this.router.navigate(['/dashboad']).then(() => {
            window.location.reload(); 
        });
     }
 });
  }

   submit() {
   this.isLoading.set(true);
   this.error.set(null);

  const readonlySig = this.accountService.registerTeacherSignal({
   dto: this.model(),
   });

     this.httpResultSignal.set(readonlySig);
   }
}