// asset-service.ts
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Asset } from '../../types/Notification'; // Asset type definition

@Injectable({
  providedIn: 'root',
})
export class AssetService {

  private http = inject(HttpClient);
  // NOTE: Assuming your repo endpoint is a typo in loadRepositoryAssets and should be baseUrl directly
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
      },
      error: () => {
        this.error.set('Asset not found or failed to load.');
        this.loading.set(false);
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
      },
      error: (err) => {
        this.error.set('Failed to add asset with OCR chunks.');
        this.loading.set(false);
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
        },
        error: (err) => {
            console.error(err);
            this.error.set('AI explanation failed. Check server logs.');
            this.loading.set(false);
            this.explainPopupVisible.set(true);
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

  // Utility to hide the explanation section
 
   public loadRepositoryAssets(repoId: string): void {
    this.repositoryAssets.set(null);
    // Adjusted URL based on typical endpoint pattern, assuming your actual endpoint is correct
    // If your working URL is `/api/assetRepository/445F...`, keep the original logic.
    const url = `${environment.apiUrl}Repository/${repoId}`;

    this.http.get<Asset[]>(url)
      .subscribe({
        next: (assets: any) => {
          // Based on your original logic, handle different response shapes
          const assetData = (assets && !Array.isArray(assets) && assets.assets) ? assets.assets : (Array.isArray(assets) ? assets : []);
          this.repositoryAssets.set(assetData);
        },
        error: (err) => {
          console.error('Failed to fetch repository assets', err);
          this.repositoryAssets.set([]);
        }
      });
  }

}