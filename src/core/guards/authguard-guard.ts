import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../../core/services/accountservices';
import { ToastService } from '../../core/services/toast-service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = accountService.currentUser();

  if (!user) {
    toastService.error('You must login first!');
    router.navigate(['/dashboad']);
    return false;
  }

  return true;
};
