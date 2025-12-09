// asset-service.ts
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Asset } from '../../types/Notification'; // Asset type definition
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  // Inject services
  private http = inject(HttpClient);
  private toastService = inject(ToastService); // Inject ToastService
  private baseUrl = environment.apiUrl + 'asset';

  asset = signal<Asset | null>(null); 
  loading = signal<boolean>(false); 
  error = signal<string | null>(null); 
  explainResult = signal<string[] | null>(null); 
  public repositoryAssets: WritableSignal<Asset[] | null> = signal(null);
  
  public explainPopupVisible = signal<boolean>(false);
  
  loadAssetWithOcr(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.asset.set(null); 
    this.http.get<Asset>(`${this.baseUrl}/${id}`).subscribe({
      next: (res) => {
        this.asset.set(res);
        this.loading.set(false);
        // Optional: Add success toast here if desired, e.g., this.toastService.success('Asset loaded successfully.');
      },
      error: () => {
        const errorMessage = 'Asset not found or failed to load.';
        this.error.set(errorMessage);
        this.loading.set(false);
        this.toastService.error(errorMessage); // Display error toast
      }
    });
  }

  addAssetWithOcr(data: { title: string, ocrPdfs: { chunkId: number; chunk: string }[] }) {
    this.loading.set(true);
    this.error.set(null);
    return this.http.post(`${this.baseUrl}/add`, data).subscribe({
      next: (res) => {
        console.log('Asset with OCR chunks added successfully:', res);
        this.loading.set(false);
        this.toastService.success('Asset added successfully!'); // Display success toast
      },
      error: (err) => {
        const errorMessage = 'Failed to add asset with OCR chunks.';
        this.error.set(errorMessage);
        this.loading.set(false);
        this.toastService.error(errorMessage); // Display error toast
      }
    });
  }


  explainText(inputText: string) { 
    this.loading.set(true);
    this.error.set(null);
    this.explainResult.set(null);

    const requestBody = { 
        text: inputText 
    };

    this.http.post<string[]>(`${this.baseUrl}/explain-text`, requestBody).subscribe({
      next: (res) => {
        this.explainResult.set(res);
        this.loading.set(false);
        this.explainPopupVisible.set(true);
        this.toastService.info('AI Explanation generated.'); // Display info toast
      },
      error: (err) => {
        console.error(err);
        const errorMessage = 'AI explanation failed. Check server logs.';
        this.error.set(errorMessage);
        this.loading.set(false);
        this.explainPopupVisible.set(true);
        this.toastService.error(errorMessage); // Display error toast
      }
    });
  }

  showExplainPopup() {
    this.explainPopupVisible.set(true);
    document.body.style.overflow = 'hidden';
  }

  hideExplainPopup() {
    this.explainPopupVisible.set(false);
    document.body.style.overflow = 'auto';
  }

  public loadRepositoryAssets(repoId: string): void {
    this.repositoryAssets.set(null);
    const url = `${environment.apiUrl}Repository/${repoId}`;

    this.http.get<Asset[]>(url)
      .subscribe({
        next: (assets: any) => {
          const assetData = (assets && !Array.isArray(assets) && assets.assets) ? assets.assets : (Array.isArray(assets) ? assets : []);
          this.repositoryAssets.set(assetData);
        },
        error: (err) => {
          console.error('Failed to fetch repository assets', err);
          this.repositoryAssets.set([]);
          this.toastService.error('Failed to fetch repository assets.'); // Display error toast
        }
      });
  }
}