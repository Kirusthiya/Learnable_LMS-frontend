import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClassDto, GlobalSearch, UserDetailsDto } from '../../types/Notification';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private baseUrl = environment.apiUrl;

  public globalSearchResults: WritableSignal<GlobalSearch[]> = signal([]);
  public classDetails: WritableSignal<ClassDto | null> = signal(null);
  public userDetails: WritableSignal<UserDetailsDto | null> = signal(null);
  public joinClassLoading: WritableSignal<boolean> = signal(false);
  public joinClassMessage: WritableSignal<string | null> = signal(null);

  public globalSearch(query: string, role: string): void {
    if (!query.trim()) {
      this.globalSearchResults.set([]);
      this.toastService.info('Please enter a search query.');
      return;
    }

    const url = `${this.baseUrl}Search/GlobalSearch`;

    this.http.get<GlobalSearch[]>(url, { params: { query, role } })
      .subscribe({
        next: results => {
          this.globalSearchResults.set(results);

          if (results.length > 0) {
            this.toastService.success(`${results.length} results found for "${query}".`);
          } else {
            this.toastService.warning(`No results found for "${query}".`);
          }
        },
        error: () => {
          this.globalSearchResults.set([]);
          this.toastService.error('Global search failed to connect to the server.');
        }
      });
  }

  public loadClassDetails(classId: string): void {
    this.classDetails.set(null);
    const url = `${this.baseUrl}Class/${classId}`;

    this.http.get<ClassDto>(url)
      .subscribe({
        next: details => {
          this.classDetails.set(details);
          this.toastService.success(`Class details for ${details.classJoinName} loaded.`);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || `Failed to fetch class details.`;
          this.classDetails.set(null);
          this.toastService.error(errorMessage);
        }
      });
  }

  public loadUserDetails(userId: string): void {
    this.userDetails.set(null);
    const url = `${this.baseUrl}User/${userId}`;

    this.http.get<UserDetailsDto>(url)
      .subscribe({
        next: details => {
          this.userDetails.set(details);
          this.toastService.success(`User details for ${details.fullName} loaded.`);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error?.message || `Failed to fetch user details.`;
          this.userDetails.set(null);
          this.toastService.error(errorMessage);
        }
      });
  }

}
