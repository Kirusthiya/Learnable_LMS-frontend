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
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterCreds,LoginCreds,SendOtpDto, User } from '../../types/user';

// -----------------------------
// Service
// -----------------------------
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // e.g., 'http://localhost:5071/api/'
  currentUser = signal<User | null>(null);

 
  sendOtp(request: SendOtpDto) {
    return this.http
      .post<{ message: string; success: boolean }>(
        this.baseUrl + 'account/send-otp',
        request
      )
      .pipe(
        tap((res) => {
          console.log(res.message);
        })
      );
  }

  // -----------------------------
  // Register User
  // -----------------------------
  register(creds: RegisterCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', {
        user: {
          fullName: creds.fullName,
          email: creds.email,
          password: creds.password,
        },
        otp: creds.otp,
      })
      .pipe(
        tap((user) => {
          if (user) this.setCurrentUser(user);
        })
      );
  }

  // -----------------------------
  // Normal Login
  // -----------------------------
  login(creds: LoginCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/login', creds)
      .pipe(
        tap((user) => {
          if (user) this.setCurrentUser(user);
        })
      );
  }

  // -----------------------------
  // Google Login
  // -----------------------------
  loginWithGoogle(idToken: string) {
    return this.http
      .post<User>(this.baseUrl + 'account/google-login', { idToken })
      .pipe(
        tap((user) => {
          if (user) this.setCurrentUser(user);
        })
      );
  }

  // -----------------------------
  // Set current user in localStorage + signal
  // -----------------------------
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  // -----------------------------
  // Logout
  // -----------------------------
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}

