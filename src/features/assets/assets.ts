// assets.ts
import { Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { AssetService } from '../../core/services/asset-service';
import { Asset } from '../../types/Notification';
import { FormsModule } from '@angular/forms';
import { Speak } from "../../core/directives/accessibility/speak";
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule, Speak, KeyboardNav], 
  templateUrl: './assets.html',
  styleUrls: ['./assets.css'],
})
export class Assets implements OnChanges {

  @Input() repoId: string | null = null;
   @Output() back = new EventEmitter<void>();
  public AssetService = inject(AssetService);

  assets = this.AssetService.repositoryAssets;
  selectedAsset = this.AssetService.asset;
  
  public AssetDetailsVisible = signal<boolean>(false); 

  ngOnChanges() {
    if (this.repoId) {
      this.AssetService.loadRepositoryAssets(this.repoId);
    } else {
      this.AssetService.repositoryAssets.set([]);
    }
  }

  
  viewAssetDetails(assetId: string) {
    this.AssetService.loadAssetWithOcr(assetId);
    this.AssetDetailsVisible.set(true); // Asset Details View-ஐக் காண்பி
  }

  goBackToList() {
    this.AssetDetailsVisible.set(false); // Asset Details View-ஐ மறை
    this.AssetService.asset.set(null); // தேர்ந்தெடுக்கப்பட்ட Asset-ஐ அழிக்கவும்
    this.AssetService.hideExplainPopup(); // Explanation Popup-ஐ மறைக்க
  }


  requestExplanation(chunk: { chunkId: number; chunk: string }) {
      if (chunk?.chunk) {
        this.AssetService.explainText(chunk.chunk);
      } else {
        alert("No OCR text available for this chunk.");
      }
    }

    goBack(): void {
    this.back.emit();
  }
    
}