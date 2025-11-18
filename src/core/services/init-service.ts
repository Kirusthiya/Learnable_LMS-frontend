// import { inject, Injectable } from '@angular/core';
// import { of } from 'rxjs';
// import { AccountService } from './accountservices';

// @Injectable({
//   providedIn: 'root'
// })
// export class InitService {

//   private accountService = inject(AccountService);

//   init() {
//     const userString = localStorage.getItem('user');
//     if (!userString) return of(null);
//     const user = JSON.parse(userString);
//     this.accountService.currentUser.set(user);

//     return of(null);
//   }
  
// }

import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AccountService } from './accountservices';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private accountService = inject(AccountService);

  init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);

    const user: User = JSON.parse(userString);

    this.accountService.setCurrentUser(user);

    return of(null);
  }
  
}
