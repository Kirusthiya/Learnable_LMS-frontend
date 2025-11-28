import { Component, computed, effect, inject } from '@angular/core';
import { GlobalSearch } from '../../types/Notification';
import { SearchService } from '../../core/services/search-service';
import { DataSharingService } from '../../core/services/DataSharingService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {
  
  searchTerm = '';
  loading = false;
  selectedItem: GlobalSearch | null = null;
  private route =inject(Router)

  suggestions = computed(() => this.searchService.searchResults());

  constructor(
    public searchService: SearchService,
    private dataSharingService: DataSharingService
  ) {
    effect(() => {
      this.searchService.searchResults();
      this.loading = false;
    });
  }

  onSearchTermChange(): void {
    if (!this.searchTerm.trim()) {
      this.searchService.clearResults();
      this.selectedItem = null;
      return;
    }

    this.loading = true;
    this.searchService.globalSearch(this.searchTerm);
  }

  selectSuggestion(item: GlobalSearch) {
    this.selectedItem = item;
    this.searchTerm = item.className || item.userName;
    this.searchService.clearResults();
  }

 viewDetails() {
  if (this.selectedItem) {
    this.dataSharingService.setSelectedSearchResult(this.selectedItem);
    // Redirect to details component
    this.route.navigate(['/details', this.selectedItem.classId || this.selectedItem.userId]);
  }
}


  // Optional: Highlight typed letters in suggestions
  highlight(text: string) {
    const re = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(re, '<b>$1</b>');
  }
}
