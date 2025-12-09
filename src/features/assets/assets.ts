import { Component, EventEmitter, Input, OnChanges, Output, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Services
import { RepositoryService } from '../../core/services/repository-service';
import { AssetService } from '../../core/services/asset-service'; 

// Types
import { Asset, Exam } from '../../types/repo-types';

// Accessibility Directives
import { Speak } from "../../core/directives/accessibility/speak";
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";

// Components
import { StudentExam } from "../student-exam/student-exam";

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule, Speak, KeyboardNav, StudentExam],
  templateUrl: './assets.html',
  styleUrls: ['./assets.css'],
})
export class Assets implements OnChanges {

  @Input() repoId: string | null = null;
  @Output() back = new EventEmitter<void>();

  // Injections
  public repositoryService = inject(RepositoryService);
  public assetService = inject(AssetService); 

  // Signals for UI Control
  public showDetailView = signal<boolean>(false);     // For Asset Details (OCR)
  public showExams = signal<boolean>(false);          // For Student Exam Component
  
  public selectedAsset = signal<Asset | null>(null);
  public selectedExam = signal<Exam | null>(null);    // Store selected exam

  // ViewChild for Focus Management
  @ViewChild('mainHeading') mainHeading!: ElementRef;
  @ViewChild('detailHeading') detailHeading!: ElementRef;

  ngOnChanges() {
    if (this.repoId) {
      this.repositoryService.getRepositoryById(this.repoId);
    } else {
      this.repositoryService.repositoryDetail.set(null);
    }
  }

  // ==========================================
  //  ASSET LOGIC
  // ==========================================

  viewAssetDetails(asset: Asset) {
    this.selectedAsset.set(asset);
    this.assetService.loadAssetWithOcr(asset.assetId);
    this.showDetailView.set(true);
    // Focus management: Move to detail heading
    setTimeout(() => this.detailHeading?.nativeElement.focus(), 100);
  }

  goBackToList() {
    this.showDetailView.set(false);
    this.selectedAsset.set(null);
    this.assetService.hideExplainPopup();
    // Focus management: Move back to main heading
    setTimeout(() => this.mainHeading?.nativeElement.focus(), 100);
  }

  requestExplanation(chunk: any) {
    if (chunk?.chunk) {
      this.assetService.explainText(chunk.chunk);
    } else {
      alert("No OCR text available for this chunk.");
    }
  }

  // ==========================================
  //  EXAM LOGIC
  // ==========================================

  /**
   * Opens the Exam View
   * This is called when user clicks or presses Enter on an Exam card
   */
  openExam(exam: Exam) {
    this.selectedExam.set(exam); // Store the selected exam
    this.showExams.set(true);    // Show the StudentExam component
  }

  toggleExamsView(show: boolean): void {
    this.showExams.set(show);
    
    if (!show) {
      // When closing exam view, clear selection and return focus to main
      this.selectedExam.set(null);
      setTimeout(() => this.mainHeading?.nativeElement.focus(), 100);
    }
  }

  // ==========================================
  //  NAVIGATION
  // ==========================================

  goBack(): void {
    this.back.emit();
  }
}