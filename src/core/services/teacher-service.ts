import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {

  private http = inject(HttpClient); 
  private baseUrl = environment.apiUrl;

  public deleteTeacherProfile(UserId: string) {
    return this.http.delete(`${this.baseUrl}teacher/${UserId}`);
   
  }
}