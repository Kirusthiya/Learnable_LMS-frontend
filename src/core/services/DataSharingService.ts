import { Injectable, signal, Signal } from '@angular/core';
import { GlobalSearch } from '../../types/Notification';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  // Define a signal with initial value null
  private selectedSearchResultSignal = signal<GlobalSearch | null>(null);

  // Expose it as a read-only signal
  selectedSearchResult: Signal<GlobalSearch | null> = this.selectedSearchResultSignal.asReadonly();

  constructor() {}

  // Method to update the signal value
  setSelectedSearchResult(result: GlobalSearch): void {
    this.selectedSearchResultSignal.set(result);
  }
}
