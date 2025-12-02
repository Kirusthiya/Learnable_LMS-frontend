import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SpeechService } from '../services/Voice/speech-service'; // <-- add this

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const speech = inject(SpeechService); // <-- inject SpeechService

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              const flatErrors = modalStateErrors.flat();
              toast.error(flatErrors.join(', '));
              speech.speak(flatErrors.join(', ')); // <-- speak the error
              throw flatErrors;
            } else {
              toast.error(error.error);
              speech.speak(error.error); // <-- speak
            }
            break;

          case 401:
            toast.error('Unauthorized');
            speech.speak('Unauthorized'); // <-- speak
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            const navigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            toast.error('Something unexpected went wrong');
            speech.speak('Something unexpected went wrong');
            console.log(error)
            break;
        }
      }
      throw error;
    })
  );
};
