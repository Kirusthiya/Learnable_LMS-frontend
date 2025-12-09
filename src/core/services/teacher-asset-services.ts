//teacherassert-services.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Import Environment
import { environment } from '../../environments/environment';

// 2. Import Your Existing Types
import { AddAssetRequest, AssetDto, ExplainDto } from '../../types/asset-types';

@Injectable({
  providedIn: 'root'
})
export class TeacherAssetService {

  // Constructs: http://localhost:5071/api/Asset
  private readonly baseUrl = `${environment.apiUrl}Asset`;

  constructor(private http: HttpClient) { }

  /**
   * ⭐ POST: Add Asset
   * URL: /api/Asset/add?id={guid}
   * @param data - The AddAssetRequest object (Body)
   * @param queryId - The Guid ID required by the C# method signature
   */
  addAsset(data: AddAssetRequest, queryId: string): Observable<AssetDto> {
    const params = new HttpParams().set('id', queryId);
    return this.http.post<AssetDto>(`${this.baseUrl}/add`, data, { params });
  }

  /**
   * ⭐ GET: Get Asset by ID
   * URL: /api/Asset/{id}
   */
  getAssetById(assetId: string): Observable<AssetDto> {
    return this.http.get<AssetDto>(`${this.baseUrl}/${assetId}`);
  }

  /**
   * ⭐ DELETE: Delete Asset
   * URL: /api/Asset/{id}
   */
  deleteAsset(assetId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${assetId}`);
  }

  /**
   * ⭐ POST: Explain Text
   * URL: /api/Asset/explain-text
   * @param data - The ExplainDto object { text: "..." }
   */
  explainText(data: ExplainDto): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/explain-text`, data);
  }
}