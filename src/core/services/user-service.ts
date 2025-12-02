import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../types/user';
import { environment } from '../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
 getUserDetails(id: string): Promise<User> {
    const url = `${this.baseUrl}User/${id}`;
    return firstValueFrom(this.http.get<User>(url));
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}user/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}user/all`);
  }

  // Update user
  updateUser(model: User) {
    return this.http.put(`${this.baseUrl}user/update`, model);
  }

  // Delete user
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}user/${id}`);
  }

  // Search users
  searchUser(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}user/search${query}`);
  }
}
