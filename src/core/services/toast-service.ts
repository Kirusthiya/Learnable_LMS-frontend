import { Injectable, inject } from '@angular/core';
import { SpeechService } from './Voice/speech-service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private speechService = inject(SpeechService);

  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-0 right-0 z-[1000] p-4 flex flex-col-reverse space-y-reverse space-y-2';
      document.body.appendChild(container);
    }
  }

  private createToastElement(message: string, alertClass: string, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    this.speechService.speak(message);

    const toastWrapper = document.createElement('div');
    toastWrapper.classList.add('toast', 'z-50', 'w-full', 'max-w-xs');

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
        <div class="flex-1">
          <span>${message}</span>
        </div>
        <button class="ml-4 p-1 rounded-full text-white/70 hover:text-white transition duration-200">✕</button>
    `;

    toastWrapper.append(toast);

    const removeToast = () => {
      if (toastContainer.contains(toastWrapper)) {
        toastContainer.removeChild(toastWrapper);
      }
      this.speechService.stopAll();
    };

    toast.querySelector('button')?.addEventListener('click', removeToast);

    toastContainer.append(toastWrapper);

    setTimeout(removeToast, duration);
  }

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
