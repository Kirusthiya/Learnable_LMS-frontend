import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

   private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/User/search?query=${query}`);
  }

  searchClasses(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Class/search?name=${name}`);
  }

  sendJoinRequest(request: { senderId: string, receiverId: string, classId: string }) {
    return this.http.post(`${this.baseUrl}/RequestNotification/class`, { requestDto: request });
  }

  approveRequest(notificationId: string) {
    return this.http.put(`${this.baseUrl}/RequestNotification/approve`, {
      requestDto: { notificationId, status: 'Approved' }
    });
  }

  rejectRequest(notificationId: string) {
    return this.http.post(`${this.baseUrl}/RequestNotification/reject/${notificationId}`, {});
  }

  search(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?query=${query}`);
  }
}

