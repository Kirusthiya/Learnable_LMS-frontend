import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/services/accountservices';
import { RequestService } from '../../core/services/request-service';
import { NotificationDto } from '../../types/Notification';
import { CommonModule } from '@angular/common';
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../core/directives/accessibility/speak";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, KeyboardNav, Speak,FormsModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  private accountService = inject(AccountService);
  private requestService = inject(RequestService);
  private router=inject(Router)

  pendingRequests = signal<any[]>([]); 
  sentRequests = signal<any[]>([]); 
  
  isTeacher = false;
  currentUserId!: string;

 ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (!user) return;


    this.currentUserId = user.user?.userId || user.id; // Assuming user.user.userId is the correct path
    
    this.isTeacher = user.user.role === 'Teacher'; 
    if (this.isTeacher) {
      this.loadReceivedRequests();
    } else {
      this.loadSentRequests();
    }
  }
  loadReceivedRequests(): void {
    this.requestService.getReceivedRequests().subscribe(requests => {
      this.pendingRequests.set(requests);
    });
  }

  loadSentRequests(): void {    this.requestService.getSentRequests().subscribe(requests => {
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

goBack() {
      this.router.navigateByUrl('/dashboad');
  } 
  
}
