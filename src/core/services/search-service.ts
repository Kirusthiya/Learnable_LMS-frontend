import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClassDto, GlobalSearch, UserDetailsDto } from '../../types/Notification';



@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // e.g., 'http://localhost:5071/api/'

  // === Signals ===
  public globalSearchResults: WritableSignal<GlobalSearch[]> = signal([]);
  public classDetails: WritableSignal<ClassDto | null> = signal(null);
  public userDetails: WritableSignal<UserDetailsDto | null> = signal(null);
  public joinClassLoading: WritableSignal<boolean> = signal(false);
  public joinClassMessage: WritableSignal<string | null> = signal(null);

  // === Global Search ===
  public globalSearch(query: string): void {
    if (!query || query.trim() === '') {
      this.globalSearchResults.set([]);
      return;
    }

    const url = `${this.baseUrl}Search/GlobalSearch`;
    this.http.get<GlobalSearch[]>(url, { params: { query } })
      .subscribe({
        next: (results) => this.globalSearchResults.set(results),
        error: (err) => {
          console.error('Global search failed', err);
          this.globalSearchResults.set([]);
        }
      });
  }

  // === Class Details ===
  public loadClassDetails(classId: string): void {
    this.classDetails.set(null);
    const url = `${this.baseUrl}Class/${classId}`;
    this.http.get<ClassDto>(url)
      .subscribe({
        next: (details) => this.classDetails.set(details),
        error: (err) => {
          console.error('Class details fetch failed', err);
          this.classDetails.set(null);
        }
      });
  }

  // === User Details + enrolled classes ===
public loadUserDetails(userId: string): void {
  this.userDetails.set(null);
  const url = `${this.baseUrl}User/${userId}`;
  
  this.http.get<UserDetailsDto>(url)
    .subscribe({
      next: (details) => {
        this.userDetails.set(details);
      },
      error: (err) => {
        console.error('User details fetch failed', err);
        this.userDetails.set(null);
      }
    });
}

}