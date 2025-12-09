import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 👇 UPDATED IMPORTS based on your file names
import { RepositoryService } from '../../../core/services/repository-service';
import { TeacherAssetService } from '../../../core/services/teacher-asset-services'; 
import { ExamService } from '../../../core/services/teacher-exam-service'; 

import { RepositoryDetail } from '../../../types/repo-types';
import { AssetDto } from '../../../types/asset-types';
import { ExamDto } from '../../../types/exam-types';
import { AddAssetExam } from "../add-asset-exam/add-asset-exam";

@Component({
  selector: 'app-assets-teacher',
  standalone: true,
  imports: [CommonModule, AddAssetExam],
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
    // Check for repoId or repositoryId depending on what object is passed
    const id = this.repository.repositoryId || this.repository.repoId;
    if (id) {
      this.repositoryService.getRepositoryById(id);
      this.cdr.markForCheck();
    }
  }

  openAddExamAsset() {
    this.showAddExamAsset.set(true);
  }

  closeAddExamAsset() {
    this.showAddExamAsset.set(false);
    this.loadRepositoryDetails(); 
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
        this.loadRepositoryDetails(); // Refresh list
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
        this.loadRepositoryDetails(); // Refresh list
      },
      error: (err: any) => {
        this.isActionLoading.set(false);
        console.error('Error deleting exam:', err);
        alert('Failed to delete exam.');
      }
    });
  }
}