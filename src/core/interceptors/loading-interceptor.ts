
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading';


export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  

  const loadingService = inject(LoadingService);
  const startTime = Date.now();

  loadingService.show(); 

  return next(req).pipe(
    finalize(() => {
      loadingService.hide(startTime); 
    })
  );
};
