import { Component, inject, signal } from '@angular/core';
import { RegisterTeacher } from '../../account/register-teacher/register-teacher';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgradeplan',
  imports: [RegisterTeacher,CommonModule,FormsModule],
  templateUrl: './upgradeplan.html',
  styleUrl: './upgradeplan.css',
})
export class Upgradeplan {

  showRegisterTeacher = signal(false);

  
  
    private router=inject(Router)
  
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
}
