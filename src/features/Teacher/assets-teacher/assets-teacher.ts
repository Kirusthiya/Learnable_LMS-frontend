import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepositoryService } from '../../../core/services/repository-service';
import { TeacherAssetService } from '../../../core/services/teacher-asset-services'; 
import { ExamService } from '../../../core/services/teacher-exam-service'; 

import { RepositoryDetail } from '../../../types/repo-types';
import { AssetDto } from '../../../types/asset-types';
import { ExamDto } from '../../../types/exam-types';
import { AddAssetExam } from "../add-asset-exam/add-asset-exam";
import { Marks } from "../marks/marks"; 

@Component({
  selector: 'app-assets-teacher',
  standalone: true,
  imports: [CommonModule, AddAssetExam, Marks],
  templateUrl: './assets-teacher.html',
  styleUrls: ['./assets-teacher.css'],
})
export class AssetsTeacher implements OnInit, OnChanges {
  @Input() repository: RepositoryDetail | any;
  @Output() close = new EventEmitter<void>();

  private repositoryService = inject(RepositoryService);
  private assetService = inject(TeacherAssetService);
  private examService = inject(ExamService);
  private cdr = inject(ChangeDetectorRef);

  repoDetails = this.repositoryService.repositoryDetail;
  loading = this.repositoryService.loading;

  showAddExamAsset = signal(false);
  isActionLoading = signal(false);

  // Signals for Marks View
  showMarksView = signal(false);
  selectedExamForMarks = signal<ExamDto | null>(null);

  ngOnInit(): void {
    this.loadRepositoryDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['repository'] && changes['repository'].currentValue) {
      this.loadRepositoryDetails();
    }
  }

  private loadRepositoryDetails(): void {
    if (!this.repository) return;
    const id = this.repository.repositoryId || this.repository.repoId;
    if (id) {
      this.repositoryService.getRepositoryById(id);
      this.cdr.markForCheck();
    }
  }

  // --- Add Asset Modal Logic ---
  openAddExamAsset() {
    this.showAddExamAsset.set(true);
  }

  closeAddExamAsset() {
    this.showAddExamAsset.set(false);
    this.loadRepositoryDetails(); 
  }

  // 👇 UPDATED FUNCTION FOR MARKS LOGIC
  // '?' means exam is optional. If clicked from header, it takes the first exam.
  openMarks(exam?: ExamDto) {
    const examsList = this.repoDetails()?.exams;
    
    // If an exam is passed, use it. Otherwise, pick the first one from the list.
    const targetExam = exam || (examsList && examsList.length > 0 ? examsList[0] : null);

    if (targetExam) {
      this.selectedExamForMarks.set(targetExam);
      this.showMarksView.set(true);
    } else {
      alert("No exams available to manage marks.");
    }
  }

  closeMarks() {
    this.showMarksView.set(false);
    this.selectedExamForMarks.set(null);
  }

  // ==========================================
  //  ASSET ACTIONS
  // ==========================================

  viewAsset(assetId: string) {
    this.isActionLoading.set(true);
    this.assetService.getAssetById(assetId).subscribe({
      next: (asset: AssetDto) => {
        this.isActionLoading.set(false);
        if (asset && asset.url) {
          window.open(asset.url, '_blank');
        } else {
          alert('Asset URL not found.');
        }
      },
      error: (err: any) => {
        this.isActionLoading.set(false);
        console.error('Error fetching asset:', err);
        alert('Could not load asset details.');
      }
    });
  }

  deleteAsset(assetId: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    this.isActionLoading.set(true);
    this.assetService.deleteAsset(assetId).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.loadRepositoryDetails(); 
      },
      error: (err: any) => {
        this.isActionLoading.set(false);
        console.error('Error deleting asset:', err);
        alert('Failed to delete asset.');
      }
    });
  }

  // ==========================================
  //  EXAM ACTIONS
  // ==========================================

  viewExam(examId: string) {
    this.isActionLoading.set(true);
    this.examService.getExamById(examId).subscribe({
      next: (exam: ExamDto) => {
        this.isActionLoading.set(false);
        console.log('Exam Details Fetched:', exam);
        alert(`Exam "${exam.title}" loaded. (Check console for full object)`);
      },
      error: (err: any) => {
        this.isActionLoading.set(false);
        console.error('Error fetching exam:', err);
        alert('Could not load exam details.');
      }
    });
  }

  deleteExam(examId: string) {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    this.isActionLoading.set(true);
    this.examService.deleteExam(examId).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.loadRepositoryDetails(); 
      },
      error: (err: any) => {
        this.isActionLoading.set(false);
        console.error('Error deleting exam:', err);
        alert('Failed to delete exam.');
      }
    });
  }
}