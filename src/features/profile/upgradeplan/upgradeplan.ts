import { Component, signal } from '@angular/core';
import { RegisterTeacher } from '../../account/register-teacher/register-teacher';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upgradeplan',
  imports: [RegisterTeacher,CommonModule,FormsModule],
  templateUrl: './upgradeplan.html',
  styleUrl: './upgradeplan.css',
})
export class Upgradeplan {

  showRegisterTeacher = signal(false);

  openRegisterTeacher() {
    this.showRegisterTeacher.set(true);
  }

  closeRegisterTeacher() {
    this.showRegisterTeacher.set(false);
  }
}
