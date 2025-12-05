import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading: WritableSignal<boolean> = signal(false);
  
  private activeRequests = 0;
  
  private minDisplayTime =300; 

  constructor() { }

  show(): void {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide(startTime: number): void {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.activeRequests = 0; 
      const loadTime = Date.now() - startTime;
      const remainingTime = this.minDisplayTime - loadTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          this.isLoading.set(false);
        }, remainingTime);
      } else {
        this.isLoading.set(false);
      }
    }
  }
}