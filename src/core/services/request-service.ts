import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Send Join Request
  sendJoinRequest(dto: any) {
    return this.http.post(`${this.baseUrl}RequestNotification/class`, dto);
  }

  // Approve Request
  approve(dto: any) {
    return this.http.put(`${this.baseUrl}RequestNotification/approve`, dto);
  }

  // Reject Request
  reject(dto: any) {
    return this.http.post(`${this.baseUrl}RequestNotification/reject`, dto);
  }
}
