import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { RegisterCreds, UserResponse } from '../../types/user';
import { Observable, tap } from 'rxjs';
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
    
    // ⭐ NEW: Constructor to load user on service initialization
    constructor() {
        this.loadCurrentUser();
    }
    
    // ⭐ NEW: Private method to load user data from localStorage
    private loadCurrentUser() {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user: UserResponse = JSON.parse(userJson);
                this.currentUser.set(user);
            } catch (e) {
                console.error('Error parsing stored user data:', e);
                localStorage.removeItem('user'); // Clear corrupted data
            }
        }
    }

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

  refreshCurrentUser(updated: UserResponse) {
  localStorage.setItem('user', JSON.stringify(updated));
  this.currentUser.set(updated);
}

  // Delete teacher by UserId
  deleteTeacher(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/teacher/${userId}`, {});
  }

 getUserById(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}User/${userId}`).pipe(
      tap(fetchedUser => {
        const currentUser = this.currentUser();
        
        const currentId = (currentUser as any)?.userId || (currentUser as any)?.id;
        const fetchedId = (fetchedUser as any)?.userId || (fetchedUser as any)?.id;

        if (currentId && currentId === fetchedId) {
             console.log('Refreshing Current User Data via getUserById...');
             this.setCurrentUser(fetchedUser); 
        }
      })
    );
  }
}