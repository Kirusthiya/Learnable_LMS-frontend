import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterTeacher } from '../../account/register-teacher/register-teacher';

import { AccountService } from '../../../core/services/accountservices';
import { TeacherService } from '../../../core/services/teacher-service';
import { ToastService } from '../../../core/services/toast-service';
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";

@Component({
  selector: 'app-upgradeplan',
  imports: [RegisterTeacher, CommonModule, FormsModule, KeyboardNav, Speak],
  templateUrl: './upgradeplan.html',
  styleUrl: './upgradeplan.css',
})
export class Upgradeplan {
  
  private accountService = inject(AccountService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private toast =inject(ToastService)


  showRegisterTeacher = signal(false);

  userRole = computed(() => this.accountService.currentUser()?.user.role);
  userId = this.accountService.currentUser()?.user.userId;

  goBack() {

    this.router.navigateByUrl('/dashboad'); 
  }


  openRegisterTeacher() {
    this.showRegisterTeacher.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeRegisterTeacher() {
    this.showRegisterTeacher.set(false);
    document.body.style.overflow = 'auto';
  }

  unsubscribeTeacherRole() {
    const userId = this.userId;

    if (!userId) {
      alert("Error: User not found.");
     this.toast.warning('Error: User not found."')
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to unsubscribe from the Teacher role? This will delete your Teacher profile permanently."
    );
 this.toast.info('Are you sure you want to unsubscribe from the Teacher role? This will delete your Teacher profile permanently.')

    if (!confirmDelete) return;

    console.log("Deleting Teacher Profile for UserId:", userId);

    this.teacherService.deleteTeacherProfile(userId).subscribe({
      next: () => {
        alert("Teacher role removed successfully.");
        this.toast.success('Teacher role removed successfully.')
 
        const current = this.accountService.currentUser();
        if (current) {
             const updatedUser = {...current, user: {...current.user, role: 'Student'}};
             this.accountService.refreshCurrentUser(updatedUser);
        }

    this.router.navigateByUrl('/dashboad').then(() => {
            window.location.reload(); 
        });
      },
      error: (err) => {
     console.error("Delete failed:", err);

        const errorDetail = err.error && err.error.error ? err.error.error : 'Try again.';
       alert(`Failed to delete teacher profile: ${errorDetail}`);
      }
    });
  }
}