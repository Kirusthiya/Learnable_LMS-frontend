import { Component, computed, effect, inject, signal,HostListener } from '@angular/core';
import { GlobalSearch } from '../../types/Notification';
import { SearchService } from '../../core/services/search-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/accountservices';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {
  private searchService = inject(SearchService);
  private accountService = inject(AccountService);

  isDropdownVisible = signal(false);
  searchText: string = '';

  searchResults = this.searchService.globalSearchResults; 
  router = inject(Router);

  handleSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;

    this.searchService.globalSearch(
      query,
      this.accountService.currentUser()?.user.role || 'student'
    );

    this.isDropdownVisible.set(query.trim().length > 0);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-wrapper')) {
      this.isDropdownVisible.set(false);
      this.searchText = ''; // <-- works now
    }
  }

  toggleDropdown() {
    this.isDropdownVisible.set(!this.isDropdownVisible());
    if (!this.isDropdownVisible()) {
      this.searchText = '';
    }
  }

  viewDetails(selectedId: string, selectedType: 'User' | 'Class'): void {
    this.isDropdownVisible.set(false);
    if (!selectedId) return;

    this.router.navigate(['/details', selectedId], {
      queryParams: { type: selectedType }
    });
  }
}
