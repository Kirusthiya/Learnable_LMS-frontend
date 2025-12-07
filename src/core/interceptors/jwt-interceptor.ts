import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/accountservices'; 

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const userResponse = accountService.currentUser(); 
  const token = userResponse?.user?.token || userResponse?.user.token; 
  console.log('Checking for token. Token value:', token ? 'Found' : 'Missing'); 

  if (token) {
    console.log('Token Found. Adding Authorization Header.'); 
    req = req.clone({
    setHeaders: {
    Authorization: `Bearer ${token}`,
    },
  });
    return next(req); } 
  else {
      console.log('Token NOT Found. Request sent without Authorization Header.'); 
  }

  return next(req);
};