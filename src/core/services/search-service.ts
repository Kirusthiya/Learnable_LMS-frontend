import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalSearch } from '../../types/Notification';
import { Subject, debounceTime, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:5071/api/Search';

  // Signal for storing search results
  private _results = signal<GlobalSearch[]>([]);
  searchResults = this._results.asReadonly();

  // Subject to handle input changes
  private searchTerm$ = new Subject<string>();

  constructor(private http: HttpClient) {
    // Observable pipeline for debouncing and API call
    this.searchTerm$.pipe(
      debounceTime(300),
      switchMap(term => {
        if (!term.trim()) return of([]); // Empty search returns empty array
        return this.http.get<GlobalSearch[]>(`${this.apiUrl}?query=${encodeURIComponent(term)}`);
      })
    ).subscribe({
      next: (res: GlobalSearch[]) => this._results.set(res),
      error: () => this._results.set([])
    });
  }

  // Called from component when user types
  globalSearch(term: string) {
    this.searchTerm$.next(term);
  }

  // Clear results signal
  clearResults() {
    this._results.set([]);
  }
}
