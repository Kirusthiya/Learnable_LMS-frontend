import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { InitService } from '../core/services/init-service';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { lastValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor])),

    provideAppInitializer(async () => {
      const initService = inject(InitService);

      try {
        // Wait for backend initialization
        await lastValueFrom(initService.init());
      } catch (err) {
        console.error('InitService failed', err);
      } finally {
        // Remove splash safely with fade
        const splash = document.getElementById('initial-splash');
        const app = document.querySelector('app-root');
        if (splash && app) {
          splash.classList.add('opacity-0');
          setTimeout(() => {
            splash.remove();
            app.classList.remove('opacity-0');
          }, 500); // matches tailwind transition
        }
      }
    }),
  ],
};
