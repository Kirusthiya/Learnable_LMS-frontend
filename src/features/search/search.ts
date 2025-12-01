import { Component, computed, effect, inject, signal } from '@angular/core';
import { GlobalSearch } from '../../types/Notification';
import { SearchService } from '../../core/services/search-service';
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
 private searchService = inject(SearchService);
  
  // Directly access the signal from the service
  searchResults = this.searchService.globalSearchResults; 
  router = inject(Router);

  handleSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    // Call the service function to initiate the request and update the signal
    this.searchService.globalSearch(query);
  }
  
// viewDetails(selectedId: string, selectedType: 'User' | 'Class'): void {
//     if (!selectedId) return console.error('ID is missing');

//     if (selectedType === 'User') {
//       this.router.navigate(['/details', selectedId, { type: 'User' }]);
//     } else {
//       this.router.navigate(['/details', selectedId, { type: 'Class' }]);
//     }
// }

// ... in Search component
viewDetails(selectedId: string, selectedType: 'User' | 'Class'): void {
    if (!selectedId) return console.error('ID is missing');

    this.router.navigate(['/details', selectedId], { 
      queryParams: { 
        type: selectedType // <-- 'queryParams' என்று மாற்றவும்
      } 
    });
}

}