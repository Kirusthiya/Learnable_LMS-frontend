import { Component, computed, effect, inject, signal } from '@angular/core';
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
  
  // Directly access the signal from the service
  searchResults = this.searchService.globalSearchResults; 
  router = inject(Router);

  handleSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchService.globalSearch(query, (this.accountService.currentUser()?.user.role|| 'student'));
  }
  

viewDetails(selectedId: string, selectedType: 'User' | 'Class'): void {
    if (!selectedId) return console.error('ID is missing');

    this.router.navigate(['/details', selectedId], { 
      queryParams: { 
        type: selectedType 
      } 
    });
}

}