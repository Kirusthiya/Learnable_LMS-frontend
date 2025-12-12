// init-service.ts
import { inject, Injectable } from '@angular/core';
import { AccountService } from './accountservices';
import { UserResponse } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountService = inject(AccountService);

  init() {
    return new Promise<void>((resolve) => {
      console.log('InitService Starting...');
      const userString = localStorage.getItem('user');

      if (userString) {
        try {
          const userResponse: UserResponse = JSON.parse(userString);
          console.log('InitService: User found in LocalStorage', userResponse);
          this.accountService.currentUser.set(userResponse); 
        } catch (error) {
          console.error('InitService: JSON Parse Error', error);
          localStorage.removeItem('user'); 
        }
      } else {
        console.warn('InitService: No User found in LocalStorage');
      }
      
      resolve(); 
    });
  }
}