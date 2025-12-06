import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/services/accountservices';
import { RequestService } from '../../core/services/request-service';
import { NotificationDto } from '../../types/Notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  private accountService = inject(AccountService);
  private requestService = inject(RequestService);

  // Signals to hold the data
  pendingRequests = signal<any[]>([]); 
  sentRequests = signal<any[]>([]); 
  
  isTeacher = false;
  currentUserId!: string;

 ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (!user) return;

    // 🛑 CRITICAL FIX: Ensure you use the correct path to the User ID
    // Use nullish coalescing or checking to be safe
    this.currentUserId = user.user?.userId || user.id; // Assuming user.user.userId is the correct path
    
    this.isTeacher = user.user.role === 'Teacher'; 
    // The rest of the logic is correct for calling the service with zero arguments
    if (this.isTeacher) {
      this.loadReceivedRequests();
    } else {
      this.loadSentRequests();
    }
  }
  loadReceivedRequests(): void {
    // 1. Teacher: Fetch pending requests sent TO them
    // ✅ CORRECT: Assuming the backend uses the JWT token to get the user ID.
    this.requestService.getReceivedRequests().subscribe(requests => {
      this.pendingRequests.set(requests);
    });
  }

  loadSentRequests(): void {
    // ✅ CORRECT: Assuming the backend uses the JWT token to get the user ID.
    this.requestService.getSentRequests().subscribe(requests => {
      this.sentRequests.set(requests);
    });

}
 handleApprove(requestId: string): void {
    const payload = {
      RequestDto: {
      NotificationId: requestId
      }
    };

  this.requestService.approve(payload).subscribe({ // Use the wrapped payload
    next: () => {
      alert('Request Approved!');
      this.loadReceivedRequests(); 
    },
    error: (err) => {
      // Log the error to debug the exact message structure
      console.error('Approval failed', err.error || err); 
    }
  });
}

handleReject(requestId: string): void {
    const payload = {
      RequestDto: {
        NotificationId: requestId
      }
    };
  this.requestService.reject(payload).subscribe({ // Use the wrapped payload
    next: () => {
      alert('Request Rejected!');
      this.loadReceivedRequests();
    },
    error: (err) => {
      console.error('Rejection failed', err.error || err);
    }
  });
}

  // 🚨 FIX 3: Add the missing getStatusClass method
getStatusClass(status: string): string {
  switch (status) {
    case 'Approved':
      return 'text-green-500 font-bold'; // Use a class for approved status
    case 'Rejected':
      return 'text-red-500 font-bold';   // Use a class for rejected status
    case 'Pending':
      return 'text-yellow-500';          // Use a class for pending status
    default:
      return 'text-gray-400';
  }
}
}
