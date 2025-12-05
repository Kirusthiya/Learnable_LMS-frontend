import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UpdateUserPayload, User } from '../../types/user';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
  updateUser(payload: UpdateUserPayload) {
    const url = `${this.baseUrl}User/update`;

      const command = {
      fullName: payload.fullName,
      displayName: payload.displayName,
      username: payload.newUsername // C# Command-ல் username என இருந்தால், இதை 'username' என்றே அனுப்பலாம்.
    }
     return this.http.put(url, command);
       }
}
