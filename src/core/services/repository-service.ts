import { Injectable, inject, NgZone, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Repository, RepositoryDto } from '../../types/user';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private toastService = inject(ToastService);
  private baseUrl = environment.apiUrl;

  public repositories: WritableSignal<Repository[]> = signal([]);
  public selectedRepo: WritableSignal<Repository | null> = signal(null);
  public loading: WritableSignal<boolean> = signal(false);

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
        this.toastService.error('Failed to load repositories.');
      }
    });
  }

  public selectRepository(repo: Repository): void {
    this.selectedRepo.set(repo);
    this.toastService.info(`Viewing repository: ${repo.fileName}`);
  }

  public addRepository(dto: RepositoryDto) {
    if (!dto.classId || !dto.repoName) {
      const errorMessage = 'Class ID and Repository Name are required.';
      console.error(errorMessage);
      this.toastService.error(errorMessage);
      return;
    }

    this.http.post(`${this.baseUrl}Repository`, { createRepositoryDto: dto }).subscribe({
      next: (res) => {
        this.toastService.success(`Repository '${dto.repoName}' created successfully!`);
        this.ngZone.run(() => this.loadRepositories(dto.classId));
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || `Failed to create repository '${dto.repoName}'.`;
        console.error('Create repository failed:', err);
        this.toastService.error(errorMessage);
      }
    });
  }

  public deleteRepository(repoId: string, classId: string) {
    this.http.delete(`${this.baseUrl}Repository/${repoId}`).subscribe({
      next: () => {
        this.toastService.warning('Repository deleted successfully.');
        this.loadRepositories(classId);
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'Failed to delete repository.';
        console.error("Delete repository failed:", err);
        this.toastService.error(errorMessage);
      }
    });
  }
}
