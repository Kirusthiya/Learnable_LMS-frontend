import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarksService } from '../../../core/services/marks-service';
import { ExamDto } from '../../../types/exam-types';
import { User } from '../../../types/user';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-marks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marks.html',
  styleUrls: []
})
export class Marks implements OnChanges {
  
  // 1️⃣ Services
  private marksService = inject(MarksService);
  private userService = inject(UserService);

  // 2️⃣ Inputs & Outputs
  @Input() exam: ExamDto | any;
  @Output() close = new EventEmitter<void>();

  // 3️⃣ Signals
  marksList = this.marksService.marksList;
  loading = this.marksService.loading;
  error = this.marksService.error;

  // 4️⃣ Cache for Student Data
  studentData: { [key: string]: User } = {}; 
  loadingUsers = false;

  constructor() {
    // Marks Load ஆனதும் User Names எடுக்க effect பயன்படுத்துகிறோம்
    effect(() => {
      const marks = this.marksList();
      if (marks && marks.length > 0) {
        this.fetchStudentDetails(marks);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam?.examId) {
      this.fetchMarks();
    }
  }

  fetchMarks() {
    this.studentData = {}; 
    this.marksService.getMarksByExam(this.exam.examId).subscribe();
  }

  async fetchStudentDetails(currentMarks: any[]) {
    if (this.loadingUsers) return;
    this.loadingUsers = true;
    
    try {
      const studentIds = [...new Set(currentMarks.map(m => m.studentId))];
      const idsToFetch = studentIds.filter(id => !this.studentData[id]);

      if (idsToFetch.length === 0) {
        this.loadingUsers = false;
        return;
      }

      const promises = idsToFetch.map(async (id) => {
        try {
          const rawData: any = await this.userService.getUserDetails(id);
          // API Response-ஐ சரி செய்தல் (Flattening if nested)
          return rawData.user ? rawData.user : rawData;
        } catch (err) {
          return null;
        }
      });

      const users = await Promise.all(promises);

      users.forEach((user: User | null) => {
        if (user && user.userId) {
          this.studentData[user.userId] = user;
        }
      });

    } catch (err) {
      console.error(err);
    } finally {
      this.loadingUsers = false;
    }
  }

  editMark(studentId: string) {
    this.marksService.getMark(this.exam.examId, studentId).subscribe();
  }
}