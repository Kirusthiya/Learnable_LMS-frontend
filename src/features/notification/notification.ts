import { Component, inject, signal, OnInit } from '@angular/core';
import { AccountService } from '../../core/services/accountservices';
import { RequestService } from '../../core/services/request-service';
import { CommonModule } from '@angular/common';
import { KeyboardNav } from "../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../core/directives/accessibility/speak";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, KeyboardNav, Speak, FormsModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  private accountService = inject(AccountService);
  private requestService = inject(RequestService);
  private router = inject(Router);
  private toastService = inject(ToastService);


  pendingRequests = signal<any[]>([]);
  sentRequests = signal<any[]>([]);
  
  isTeacher = false;
  currentUserId!: string;

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (!user) return;

    this.currentUserId = user.user?.userId || user.id;
    this.isTeacher = user.user.role === 'Teacher';

    this.loadReceivedRequests();
    this.loadSentRequests();
  }

  loadReceivedRequests(): void {
    this.requestService.getReceivedRequests().subscribe({
      next: requests => this.pendingRequests.set(requests),
      
      error: () => this.toastService.error('Failed to load received requests.')
    });
  }

  loadSentRequests(): void {
    this.requestService.getSentRequests().subscribe({
      next: requests => this.sentRequests.set(requests),
      error: () => this.toastService.error('Failed to load sent requests.')
    });
  }

handleApprove(requestId: string): void {
    const payload = { RequestDto: { NotificationId: requestId } };

    this.requestService.approve(payload).subscribe({
        next: () => {
            this.toastService.success('Request Approved! The user has been added.');
            this.loadReceivedRequests(); 
            const currentUser = this.accountService.currentUser();
            const myUserId = currentUser?.user?.userId || currentUser?.id;

            if (myUserId) {
                this.accountService.getUserById(myUserId).subscribe({
                    next: () => console.log('User data refreshed successfully after approval.'),
                    error: (err) => console.error('Failed to refresh user data:', err)
                });
            }
        },
        error: (err) => {
            console.log(err.error);
        }
    });
}

  handleReject(requestId: string): void {
    const payload = { RequestDto: { NotificationId: requestId } };

    this.requestService.reject(payload).subscribe({
      next: () => {
        this.toastService.info('Request Rejected.');
        this.loadReceivedRequests();
      },
      error: (err) => {
        const errorDetail = err.error?.message || 'Server error';
        this.toastService.error(`Rejection failed: ${errorDetail}`);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'text-green-500 font-bold';
      case 'Rejected': return 'text-red-500 font-bold';
      case 'Pending': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboad');
  }
}
