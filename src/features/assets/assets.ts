import { Component, EventEmitter, Input, OnChanges, Output, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Services
import { RepositoryService } from '../../core/services/repository-service';
import { AssetService } from '../../core/services/asset-service'; 

// Types
import { Asset, Exam } from '../../types/repo-types';

// Directives
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";

// Components
import { StudentExam } from "../student-exam/student-exam";

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyboardNav, StudentExam],
  templateUrl: './assets.html',
  styleUrls: ['./assets.css'],
})
export class Assets implements OnChanges {

  @Input() repoId: string | null = null;
  @Output() back = new EventEmitter<void>();

  public repositoryService = inject(RepositoryService);
  public assetService = inject(AssetService); 

  // Signals
  public showDetailView = signal<boolean>(false);
  public showExams = signal<boolean>(false);
  
  public selectedAsset = signal<Asset | null>(null);
  public selectedExam = signal<Exam | null>(null);

  @ViewChild('mainHeading') mainHeading!: ElementRef;
  @ViewChild('detailHeading') detailHeading!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ngOnChanges() {
    if (this.repoId) {
      this.repositoryService.getRepositoryById(this.repoId);
    } else {
      this.repositoryService.repositoryDetail.set(null);
    }
  }

  viewAssetDetails(asset: Asset) {
    this.speak("Opening " + asset.title);
    this.selectedAsset.set(asset);
    this.assetService.loadAssetWithOcr(asset.assetId);
    this.showDetailView.set(true);
    setTimeout(() => this.detailHeading?.nativeElement.focus(), 100);
  }

  goBackToList() {
    this.speak("Returning to asset list");
    this.showDetailView.set(false);
    this.selectedAsset.set(null);
    this.closePopup();
    setTimeout(() => this.mainHeading?.nativeElement.focus(), 100);
  }

  // --- POPUP LOGIC ---

  requestExplanation(chunk: any) {
    if (!chunk?.chunk) {
      this.speak("No text available to explain.");
      alert("No text available to explain."); 
      return;
    }

    // Voice Feedback
    this.speak("Analyzing text. Please wait.");

    // 1. Open Popup Immediately so Animation shows
    this.assetService.explainPopupVisible.set(true); 
    
    // 3. Trigger API Call
    this.assetService.explainText(chunk.chunk);
      
    // 4. Move Focus into Popup (Close button acts as a safe anchor)
    setTimeout(() => {
        if(this.closeBtn) {
            this.closeBtn.nativeElement.focus(); 
        }
    }, 100);
  }

  closePopup() {
    this.speak("Closing explanation window");
    this.assetService.hideExplainPopup();
    // Return focus to the detailed view
    if (this.detailHeading) {
        setTimeout(() => this.detailHeading.nativeElement.focus(), 100);
    }
  }

  // --- EXAM LOGIC ---

  openExam(exam: Exam) {
    this.speak("Starting Exam: " + exam.title);
    this.selectedExam.set(exam); 
    this.showExams.set(true);    
  }

  toggleExamsView(show: boolean): void {
    this.showExams.set(show);
    if (!show) {
      this.selectedExam.set(null);
      this.speak("Returned from exam");
      setTimeout(() => this.mainHeading?.nativeElement.focus(), 100);
    }
  }

  goBack(): void {
    this.speak("Going back to repositories");
    window.speechSynthesis.cancel(); // Clean up before leaving
    this.back.emit();
  }

  // --- TTS (Text to Speech) Implementation ---
  // Exactly matching the logic from StudentExam

  speak(text: string) {
    window.speechSynthesis.cancel(); // Stop previous sound
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  onFocus(text: string | undefined) {
    if (text) {
      this.speak(text);
    }
  }
}