
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AccountService } from './accountservices';
import { User, UserResponse } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountService = inject(AccountService);

  init() {
    return new Promise<void>((resolve) => {
    const userString = localStorage.getItem('user');
    if (userString) {
    const userResponse: UserResponse = JSON.parse(userString);
      this.accountService.setCurrentUser(userResponse);
    }
    resolve();
    });
  }
}

  

