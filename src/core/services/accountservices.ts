import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;


  sendOtp(email: string) {
    return this.http.post(`${this.baseUrl}account/send-otp`,{email});
  }


  register(creds: RegisterCreds) {
    const body = {
      user: {
        username: creds.username,
        email: creds.email,
        password: creds.password
      },
      otp: creds.otp
    };

    return this.http.post<any>(`${this.baseUrl}account/register`, body).pipe(
      tap((res) => {
        if (res && res.user) {
          this.setCurrentUser(res.user);
        }
      })
    );
  }


  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }


  login(creds: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }


 logout(){
    localStorage.removeItem('user'); 
    this.currentUser.set(null);
  }

}
