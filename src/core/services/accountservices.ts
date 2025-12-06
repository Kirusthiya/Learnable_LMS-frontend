import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { RegisterCreds, UserResponse } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterTeacherRequest, TeacherUserDto } from '../../types/teacher';
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  currentUser = signal<UserResponse | null>(null);
  private injector = inject(Injector);


  private baseUrl = environment.apiUrl;

  // Send OTP
  sendOtp(email: string) {
    return this.http.post(`${this.baseUrl}account/send-otp`, { email });
  }

  // Register
  register(creds: RegisterCreds) {
    const body = {
      user: {
        username: creds.username,
        email: creds.email,
        password: creds.password
      },
      otp: creds.otp
    };

    return this.http.post<UserResponse>(`${this.baseUrl}account/register`, body).pipe(
      tap((res) => {
        if (res) this.setCurrentUser(res);
      })
    );
  }

  setCurrentUser(userResponse: UserResponse) {
    localStorage.setItem('user', JSON.stringify(userResponse));
     this.currentUser.set(userResponse);
   }

  // Login
  login(creds: any) {
    return this.http.post<UserResponse>(`${this.baseUrl}account/login`, creds).pipe(
      tap((res) => {
        if (res) this.setCurrentUser(res);
      })
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  registerTeacherSignal(payload: RegisterTeacherRequest) {
    return runInInjectionContext(this.injector, () =>
      toSignal(
        this.http.post<TeacherUserDto>(`${this.baseUrl}account/register-teacher`, payload),
        { initialValue: null }
      )
    );
  }

}
