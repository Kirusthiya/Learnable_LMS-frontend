// asset-types.ts

export interface OcrPdfDto {
  chunkId: number;
  chunk: string;
  ocrPdfId?: string; 
}

export interface AddAssetRequest {
  title: string;
  type: string;
  url: string;
  description?: string;
  repoId: string; 
  ocrPdfs?: OcrPdfDto[];
}

export interface AssetDto {
  assetId: string;
  id?: string; // 👈 UPDATED: Added this to fix the error (res.id)
  type: string;
  title: string;
  repoId: string;
  description?: string;
  createdAt?: string; 
  lastUpdatedAt?: string;
  url: string;
  ocrPdfs: OcrPdfDto[];
}

export interface ExplainDto {
  text: string;
}