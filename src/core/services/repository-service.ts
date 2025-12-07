import { Injectable, inject, NgZone, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Repository, RepositoryDto } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private baseUrl = environment.apiUrl;

  public repositories: WritableSignal<Repository[]> = signal([]);
  public selectedRepo: WritableSignal<Repository | null> = signal(null);
  public loading: WritableSignal<boolean> = signal(false);

  // Load all repositories for a class
  public loadRepositories(classId: string): void {
    this.loading.set(true);
    this.http.get<Repository[]>(`${this.baseUrl}Repository?classId=${classId}`).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.repositories.set(res || []);
          this.loading.set(false);
        });
      },
      error: (err) => {
        console.error("Repositories not found:", err);
        this.loading.set(false);
      }
    });
  }

  // Select repository to view details
  public selectRepository(repo: Repository): void {
    this.selectedRepo.set(repo);
  }

  // Add a new repository for a class using RepositoryDto
  public addRepository(dto: RepositoryDto) {
    if (!dto.classId || !dto.repoName) {
      console.error('classId and repoName are required!');
      return;
    }

    console.log('Repository payload:', dto);

    this.http.post(`${this.baseUrl}Repository`, { createRepositoryDto: dto }).subscribe({
      next: (res) => {
        console.log('Repository created:', res);
        this.ngZone.run(() => this.loadRepositories(dto.classId));
      },
      error: (err) => {
        console.error('Create repository failed:', err);
      }
    });
  }

  // Delete a repository
  public deleteRepository(repoId: string, classId: string) {
    this.http.delete(`${this.baseUrl}Repository/${repoId}`).subscribe({
      next: () => {
        console.log("Repository deleted");
        this.loadRepositories(classId);
      },
      error: (err) => {
        console.error("Delete repository failed:", err);
      }
    });
  }
}
