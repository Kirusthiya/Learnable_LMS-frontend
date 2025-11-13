// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable, signal } from '@angular/core';
// import { tap } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { RegisterCreds, User } from '../../types/user';

// @Injectable({
//   providedIn: 'root'
// })
// export class AccountService {

//   private http = inject(HttpClient);
//   currentUser = signal<User | null>(null);

//   private baseUrl = environment.apiUrl;


//   // REGISTER METHOD
//   register(creds: RegisterCreds) {
//     return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
//       tap((user) => {
//         if (user) {
//           this.setCurrentUser(user); 
//         }
//       })
//     );
//   }


//   login(creds: any){
//     return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
//       tap((user) => {
//         if(user){
//           this.setCurrentUser(user);
//         }
//       })
//     )
//   }

//   setCurrentUser(user: User) {
//     localStorage.setItem('user', JSON.stringify(user)); // store user in local storage
//     this.currentUser.set(user);
//   }

//   logout(){
//     localStorage.removeItem('user'); // remove user from local storage
//     this.currentUser.set(null);
//   }

//   cancel(){
    
//   }
  
// }
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private baseUrl = environment.apiUrl;

  // REGISTER METHOD
  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  // NORMAL LOGIN
  login(creds: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  // GOOGLE LOGIN
  loginWithGoogle(token: string) {
    return this.http
      .post<User>(this.baseUrl + 'account/google-login', { token })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
