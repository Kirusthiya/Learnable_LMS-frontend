import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationDto } from '../../types/Notification';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  sendJoinRequest(dto: any) {
    return this.http.post(`${this.baseUrl}RequestNotification/class`, dto);
  }

  approve(dto: any) {
    return this.http.put(`${this.baseUrl}RequestNotification/approve`, dto);
  }

  reject(dto: any) {
    return this.http.put(`${this.baseUrl}RequestNotification/reject`, dto);
  }
 getReceivedRequests() { 
   return this.http.get<NotificationDto[]>(`${this.baseUrl}RequestNotification/received`);
 }

   getSentRequests() {
     return this.http.get<NotificationDto[]>(`${this.baseUrl}RequestNotification/sent`);
  }
}
