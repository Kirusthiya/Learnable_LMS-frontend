import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { InitService } from '../core/services/init-service';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { lastValueFrom } from 'rxjs';
import { jwtInterceptor } from '../core/interceptors/jwt-interceptor';
import { AccountService } from '../core/services/accountservices';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor ,loadingInterceptor
    ])),

    provideAppInitializer(() => {
    const initService = inject(InitService);
    const router = inject(Router);
    const accountService = inject(AccountService);

    return initService.init().finally(() => {
      const splash = document.getElementById('initial-splash');
      const app = document.querySelector('app-root');
      if (splash && app) {
        splash.classList.add('opacity-0');
        setTimeout(() => {
          splash.remove();
          app.classList.remove('opacity-0'); // show app-root
        },300); // short fade, ultra-fast
      }

      const user = accountService.currentUser();
      if (user) {
        router.navigateByUrl('/dashboad');
      }
    });
  })

  ],
};
