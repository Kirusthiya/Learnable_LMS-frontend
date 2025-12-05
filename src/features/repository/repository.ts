// File: repository.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../core/services/search-service';
import { Speak } from "../../core/directives/accessibility/speak";
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";

@Component({
  selector: 'app-repository',
  imports: [CommonModule, Speak, KeyboardNav],
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
    this.openAssets.emit(repoId);
  }

  goBack(): void {
    this.back.emit();
  }
  
}
