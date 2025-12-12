import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../core/services/search-service';
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";

@Component({
  selector: 'app-repository',
  imports: [CommonModule, KeyboardNav],
  templateUrl: './repository.html',
  styleUrls: ['./repository.css'],
})
export class Repository implements OnChanges {

  @Input() classId: string | null = null;
  @Output() openAssets = new EventEmitter<string>();
  
  @Output() back = new EventEmitter<void>();

  private searchService = inject(SearchService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classId'] && this.classId) {
      this.searchService.loadClassDetails(this.classId);
    }
  }

  get classData() {
    return this.searchService.classDetails();
  }

  openRepository(repoId: string): void {
    this.speak("Opening repository details");
    this.openAssets.emit(repoId);
  }

  goBack(): void {
    this.speak("Returning to class list");
    this.back.emit();
  }

  // --- TTS (Text to Speech) Implementation ---
  speak(text: string) {
    window.speechSynthesis.cancel();
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